import { Component } from '@angular/core';
import { AuthService } from '../../auths/services/auth.service';
import { SharedModule } from '../../commons/modules/shared.module';
import { CryptoService } from '../../commons/services/crypto.service';
import { SwalService } from '../../commons/services/swal.service';
import { UserModel } from '../../users/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  user: UserModel = new UserModel()

  constructor(
    public _auth: AuthService,
    private _swal: SwalService,
    private _crypto: CryptoService
  ){ 
    this.user = JSON.parse(this._crypto.decryption(localStorage.getItem("user")))
  }

  logout() {
    this._swal.callSwal(
      "Do you want to logout?", 
      "Logout", 
      () => {this._auth.logout()}
    )
  }
}
