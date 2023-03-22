import { Component } from '@angular/core';
import { ProductModel } from './models/product.model';
import { SharedModule } from '../commons/modules/shared.module';
import { ProductPipe } from './pipes/product.pipe';
import { ProductService } from './services/product.service';
import { Router } from '@angular/router';
import { SwalService } from '../commons/services/swal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule, ProductPipe],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  products: ProductModel[] = []
  search: string = ""
  product: ProductModel = new ProductModel()

  constructor(
    private _product: ProductService,
    private _router: Router,
    private _swal: SwalService,
    private _toastr: ToastrService
  ) {
    this.getAll()
  }

  getAll() {
    this._product.getAll(res => {
      this.products = res
    })
  }

  removeById(product: ProductModel) {
    this._swal.callSwal(`Delete ${product.name}?`, 'delete', () => {
      let model = { _id: product._id }
      this._product.removeById(model, (res) => {
        this._toastr.warning(res.message)
        this.getAll()
      })
    })
  }

  setImageForModal(product: ProductModel) {
    this.product = { ...product }
  }

  changeActive(_id: string){
    this._product.changeActive(_id, res => {
      this._toastr.info(res.message)
    })
  }
}
