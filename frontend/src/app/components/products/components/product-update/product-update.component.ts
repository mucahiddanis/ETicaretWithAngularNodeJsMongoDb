import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CategoryModel } from 'src/app/components/categories/models/category.model';
import { CategoryService } from 'src/app/components/categories/services/category.service';
import { SharedModule } from 'src/app/components/commons/modules/shared.module';
import { SwalService } from 'src/app/components/commons/services/swal.service';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})


export class ProductUpdateComponent implements OnInit {

  product: ProductModel = new ProductModel()
  categories: CategoryModel[] = []
  productId: string = "";
  images: any

  constructor(
    private _category: CategoryService,
    private _product: ProductService,
    private _activated: ActivatedRoute,
    private _router: Router,
    private _swal: SwalService,
    private _toastr: ToastrService
  ) {
    this._activated.params.subscribe(res => {
      if (res["value"]) {
        this.productId = res["value"];
        this.getById();
      } else {
        this._router.navigateByUrl("/");
      }
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this._category.getAll(res => {
      this.categories = res;
    });
  }

  getById() {
    this._product.getById(this.productId, res => {
      this.product = res
    });
  }

  update(form: NgForm) {
      if (form.valid) {
      let product = form.value
      let categories: string[] = product["categoriesSelect"]
      let price = product["price"]
      price = price.toString().replace("," , ".")

      let formData = new FormData()
      formData.append("_id", this.productId)
      formData.append("name", product["name"])
      formData.append("price", price)
      formData.append("description", product["description"])
      formData.append("stock", product["stock"])
      formData.append("categoriesSelect", product["categoriesSelect"])
      for (const category of categories) {
        formData.append("categories", category)
      }
      if(this.images != undefined)
        for (const image of this.images) {
          formData.append("images", image, image.name)
        }
      this._product.update(formData, res => {
        this._toastr.info(res.message)
        this._router.navigateByUrl("/admin/products")
      })
    }
  }

  deleteImage(_id: string, index: number) {
    this._swal.callSwal("Do you to delete image?", "Delete", () => {
      this._product.removeImageByProductIdAndIndex(_id, index, res => {
        this._toastr.info(res.message)
        this.getById()
      })
    })

  }

  getImages(event: any) {
    this.images = event.target.files
  }

}

