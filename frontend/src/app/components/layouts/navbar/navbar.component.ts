import { Component } from '@angular/core';
import { AuthService } from '../../auths/services/auth.service';
import { SharedModule } from '../../commons/modules/shared.module';
import { SwalService } from '../../commons/services/swal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {

  constructor(
    public _auth: AuthService,
    private _swal: SwalService
  ){ }

  logout() {
    this._swal.callSwal(
      "Do you want to logout?", 
      "Logout", 
      () => {this._auth.logout()}
    )
  }
}
