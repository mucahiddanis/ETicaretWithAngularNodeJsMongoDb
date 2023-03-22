import { Injectable } from '@angular/core';
import { MessageResultModel } from '../../commons/models/message-result.models';
import { GenericHttpService } from '../../commons/services/generic-http.service';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private _http: GenericHttpService
  ) { }

  getAll(callBack: (res: ProductModel[]) => void){
    this._http.get<ProductModel[]>("products", res => {
      callBack(res)
    })
  }

  add(model: FormData, callBack: (res: MessageResultModel) => void) {
    this._http.post<MessageResultModel>("products/add", model, res => {
      callBack(res)
    })
  }

  removeById(model: any, callBack: (res: MessageResultModel) => void){
    this._http.post<MessageResultModel>("products/removeById", model, res => {
      callBack(res)
    })
  }
}
