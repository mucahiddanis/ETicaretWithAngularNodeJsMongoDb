import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private _toastr: ToastrService
  ) { }

  errorHandler(err: HttpErrorResponse){
    if(err.status == 0)
      this._toastr.error("Api adresine ulaşılamıyor!")
    else if (err.status == 401 || err.status == 400 || err.status == 500)
      this._toastr.error(err.error.message)
    console.log
  }
}
