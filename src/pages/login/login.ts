import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import * as bigInt from 'big-integer/BigInteger';
import {SharedService} from "../../providers/items/shared.service";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'example@gmail.com',
    password: ''
  };
  keys;

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public sharedService: SharedService,
    public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    });
    this.keys = this.generateKeys();
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }

  // Attempt to login in through our User service
  doLogin() {
    this.user.login({credentials: this.account, publicKey: {e: this.keys.e, n: this.keys.n}}).subscribe((resp) => {
      console.log(JSON.stringify(resp));
      if (!resp['success']) {
        this.presentToast(resp['message'])
        // Unable to log in
      } else {
        localStorage.setItem('token', resp['token']);
        localStorage.setItem('email', resp['user'].email);
        localStorage.setItem('username', resp['user'].username);
        localStorage.setItem('_id', resp['user']._id);
        this.navCtrl.push(MainPage);
      }
    });
  }

  generateKeys() {
    let base=bigInt(2);
    let e= bigInt(65537);
    let p=bigInt.zero, q=bigInt.zero, n=bigInt.zero, d=bigInt.zero;

    while (!bigInt(p).isPrime()) {
      p = bigInt.randBetween(base.pow(255), base.pow(256).subtract(1));
    }
    while (!bigInt(q).isPrime()) {
      q = bigInt.randBetween(base.pow(255), base.pow(256).subtract(1));
    }
    let phi = p.subtract(1).multiply(q.subtract(1));
    n = p.multiply(q);
    d = e.modInv(phi);
    console.log('Client Keys Generated');
    let myKeys = {e: e.toString(), n: n.toString(), d: d.toString()};
    this.sharedService.publishData(myKeys);
    //localStorage.setItem('keys', JSON.stringify(myKeys));
    return myKeys;
  };

}
