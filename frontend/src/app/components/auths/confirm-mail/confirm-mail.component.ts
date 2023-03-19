import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../commons/modules/shared.module';

@Component({
  selector: 'app-confirm-mail',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './confirm-mail.component.html',
  styleUrls: ['./confirm-mail.component.css']
})
export class ConfirmMailComponent implements OnInit {
  message: string = "Hata!"
  code: string = ""

  constructor(
    private _auth: AuthService,
    private _activated: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._activated.params.subscribe(res => {
      if(res["value"]) {
        this.code = res["value"]
        this.confirmMail()
      }else
        this._router.navigateByUrl("/login")
    })
  }

  confirmMail( ) {
    this._auth.confirmMail(this.code, res => {
      this.message = res.message
      setTimeout(() => this._router.navigateByUrl("/login"), 3000)
    })
  }

  changeClass() {
    if(this.message != "Hata!")
      return "bg-success-subtle p-3 text-success"

    return "bg-danger-subtle p-3 text-danger"
  }
}
