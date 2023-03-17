import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { changeLoading } from '../components/loading-button/states/loading-actions';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpServices {

  api: string = "http://localhost:3000/"
  isLoading: boolean = false;
  
  constructor(
    private _http: HttpClient,
    private store: Store<{ isLoading: boolean }>,
    private _err: ErrorService
  ) {
    this.store.select("isLoading").subscribe(res => {
      this.isLoading = res;
    })
  }

  setApiUrl(api: string, isDifferentApi: boolean) {
    if (isDifferentApi)
      return api

    return this.api + api
  }

  get<T>(api: string, callBack: (res: T) => void, isDiffrentApi: boolean = false, options = {}) {
    this.store.dispatch(changeLoading()); //true
    this._http.get<T>(this.setApiUrl(api, isDiffrentApi), {}).subscribe({
      next: (res) => {
        callBack(res);
        if (this.isLoading)
          this.store.dispatch(changeLoading()); //false
      },
      error: (err: HttpErrorResponse) => {
        this._err.errorHandler(err)
        if (this.isLoading)
          this.store.dispatch(changeLoading()); //false
      }
    })
  }

  post<T>(api: string, model: any, callBack: (res: T) => void, isDifferentApi: boolean = false, options = {}) {
    this.store.dispatch(changeLoading()); //true
    this._http.post<T>(this.setApiUrl(api, isDifferentApi), model, {}).subscribe({
      next: (res) => {
        callBack(res);
        if (this.isLoading)
          this.store.dispatch(changeLoading()); //false
      },
      error: (err: HttpErrorResponse) => {
        this._err.errorHandler(err)
        if (this.isLoading)
          this.store.dispatch(changeLoading()); //false
      }
    });
  }
}
