import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  callSwal(text: string, confirmBtnName: string, callBack: () => void , type: SweetAlertIcon = "question"){
    Swal.fire({
      text: text,
      showConfirmButton: true,
      confirmButtonText: confirmBtnName,
      confirmButtonColor: "#106b2f",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#b90b0b",
      icon: type
    }).then(res => {
      if(res.isConfirmed)
        callBack()
    })
  }
}