import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {IonicPage, LoadingController, NavController, ToastController} from 'ionic-angular';

import { User } from '../../providers';
import { MainPage } from '../';
import {WelcomePage} from "../welcome/welcome";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, email: string, password: string } = {
    username: 'Username',
    email: 'test@gmail.com',
    password: '12345678'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public translateService: TranslateService, public loadingCtrl: LoadingController) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  doSignup() {
    this.presentLoadingDefault();
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      console.log(resp);
      this.navCtrl.push(WelcomePage);
      let toast = this.toastCtrl.create({
        message: "Registred successfully. Sign In please",
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }, (err) => {

      this.navCtrl.push(WelcomePage);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
