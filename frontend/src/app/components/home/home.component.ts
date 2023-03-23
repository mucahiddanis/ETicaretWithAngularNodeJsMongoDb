import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/components/commons/modules/shared.module';
import { CategoryModel } from '../categories/models/category.model';
import { CategoryPipe } from '../categories/pipes/category.pipe';
import { CategoryService } from '../categories/services/category.service';
import { ProductModel } from '../products/models/product.model';
import { ProductService } from '../products/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CategoryPipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: CategoryModel[] = []
  search: string = ""
  selectedCategory: string = "All"
  products: ProductModel[] = []
  

  constructor(
    private _categories: CategoryService,
    private _product: ProductService
  ){
    this.getAll()
   }

  ngOnInit(): void {
    this.getCategories()
  }

  getCategories(){
    this._categories.getAll( res => this.categories = res)
  }

  getAll(){
    this._product.getAll(res => {
      this.products = res
    })
  }
}
