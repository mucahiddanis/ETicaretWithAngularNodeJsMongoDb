import { Injectable } from '@angular/core';
declare var require: any

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  CryptoJS = require("crypto-js");
  secretKey: string = "secret key 341 341 341 secret key"
  constructor() { }

  encryption(data: string){
    return this.CryptoJS.AES.encrypt(data, this.secretKey).toString()
  }

  decryption(data: string){
    var bytes = this.CryptoJS.AES.decrypt(data, this.secretKey)
    return bytes.toString(this.CryptoJS.enc.Utf8)
  }
}
