import { CategoryModel } from "../../categories/models/category.model"

export class ProductModel {
    _id: String = ""
    name: String = ""
    description: String = ""
    imageUrls: any = []
    stock: Number = 0
    categories: CategoryModel[] = []
    price: Number = 0
    createdDate: string = ""
    isActive: boolean = true
    updatedDate: string = ""
  id: string
}