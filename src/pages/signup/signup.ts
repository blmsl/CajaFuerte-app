import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../../providers/auth-service';

import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  
  account: {name: string, email: string, password: string} = {
    name: '',
    email: '',
    password: ''
  };
  alertMessage: string;

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
              public alertController: AlertController,
              public auth: AuthService,
              public translateService: TranslateService) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      this.signupErrorString = value;
    })
  }

  doSignup() {    
    this.auth.signUpWithEmail(this.account).then(() => {
      this.navCtrl.setRoot(MainPage, {}, {animate: true, direction: 'forward'});
    }).catch((error) => {
      console.log(error);
      this.SignUpError(error);
    });
  }

  SignUpError(error): void {
    switch (error.code) {
      case "auth/email-already-in-use":
          this.alertMessage = "The specified email is already in use!"
          break;
      case "auth/invalid-email":
          this.alertMessage = "The specified email is not valid!"
          break;
      case "auth/operation-not-allowed":
          this.alertMessage = "Your account has been disabled. Please contact support!"
          break;
      case "auth/weak-password":
          this.alertMessage = "Password should be at least 6 characters!"
          break;
    }
    let alert = this.alertController.create({
      title: 'Sign Up Failed',
      subTitle: this.alertMessage,
      buttons: ['Ok']
    });
    alert.present();
  }

}
