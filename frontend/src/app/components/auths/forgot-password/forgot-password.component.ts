import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../commons/modules/shared.module';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  _id: string = ""
  codeText: string = ""

  constructor(
    private _auth: AuthService,
    private _activated: ActivatedRoute,
    private _router: Router
  ) {
    this._activated.params.subscribe(res => {
      if (res["value"] != null && res["value"] != undefined) {
        this._id = res["value"]
        if (res["code"] != null && res["code"] != undefined) {
          this.codeText = res["code"]
        }
      } else {
        this._router.navigateByUrl("/login")
      }
    })
  }

  showOrHidePassword(password: HTMLInputElement) {
    if (password.type == "password")
      password.type = "text"
    else
      password.type = "password"
  }

  refreshPassword(form: NgForm) {
    if (form.valid) {
      let model = { _id: this._id, code: form.controls["code"].value, newPassword: form.controls["password"].value }
      this._auth.refreshPassword(model)
    }
  }
}
