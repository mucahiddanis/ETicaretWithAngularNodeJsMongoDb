import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageResultModel } from '../../commons/models/message-result.models';
import { CryptoService } from '../../commons/services/crypto.service';
import { GenericHttpService } from '../../commons/services/generic-http.service';
import { AuthModel } from '../login/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: GenericHttpService,
    private _router: Router,
    private _crypto: CryptoService,
    private _toastr: ToastrService
  ) { }

  login(model: any) {
    this._http.post<AuthModel>("auth/login", model, res => {
      localStorage.setItem(
        "accessToken",
        this._crypto.encryption(res.token)
      )
      localStorage.setItem(
        "user",
        this._crypto.encryption(JSON.stringify(res.user))
      )
      this._router.navigateByUrl("/")
      this._toastr.success("Login is successful!")
    })
  }

  googleLogin(model: any) {
    this._http.post<AuthModel>("auth/googleLogin", model, res => {
      localStorage.setItem(
        "accessToken",
        this._crypto.encryption(res.token)
      )
      localStorage.setItem(
        "user",
        this._crypto.encryption(JSON.stringify(res.user))
      )
      this._router.navigateByUrl("/")
      this._toastr.success("Login is successful!")
    })
  }

  register(model: any){
    this._http.post<MessageResultModel>("auth/register", model, res => {
      this._toastr.success(res.message)
      this._router.navigateByUrl("/login")
    })
  }

  logout(){
    localStorage.clear()
    window.location.href = "/login"
    // this._router.navigateByUrl("/login")
    this._toastr.warning("Logout is successful!")
  }

  sendConfirmMail (value: string) {
    let model = {emailOrUserName: value}
    this._http.post<MessageResultModel>("auth/sendConfirmMail", model, res => {
      this._toastr.info(res.message)
      let element = document.getElementById("confirmEmailModalCloseBtn")
      element.click()
    })
  }

  confirmMail(code: string, callBack: (res: MessageResultModel) => void ){
    let model = {code: code}
    this._http.post<MessageResultModel>("auth/confirm-mail", model, res => {
      callBack(res)
    })
  }

  forgotPasswordMail (value: string) {
    let model = {emailOrUserName: value}
    this._http.post<any>("auth/forgotPassword", model, res => {
      this._toastr.info("Your password reset email has been sent successfully.")
      this._router.navigateByUrl(`/forgot-password/${res._id}`)
      let element = document.getElementById("forgotPasswordModalCloseBtn")
      element.click()
    })
  }

  refreshPassword(model: any){
    this._http.post<MessageResultModel>("auth/refreshPassword", model, res => {
      this._toastr.info(res.message)
      this._router.navigateByUrl("/login")
    })
  }

  // used new guard
  isLogged() {
    let token = localStorage.getItem("accessToken")

    if (token != null && token != undefined) {
      return true
    }
    this._router.navigateByUrl("/login")
    return false
  }
}

