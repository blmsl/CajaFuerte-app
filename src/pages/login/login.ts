import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../../providers/auth-service';

import { MainPage } from '../../pages/pages';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  account: {email: string, password: string} = {
    email: 'luis@example.com',
    password: 'test123'
  };

  // Our translated text strings
  private loginErrorString: string;

  constructor(public navCtrl: NavController,
              public alertController: AlertController,
              public auth: AuthService,
              public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.auth.signInWithEmail(this.account).then(() => {
      this.navCtrl.setRoot(MainPage, {}, {animate: true, direction: 'forward'});
    }).catch((error) => {
      console.log(error);
      this.LoginError(error);
    });

  }

  LoginError(error) {
    let alert = this.alertController.create({
      title: 'Login Failed',
      subTitle: 'Please check your email and/or password and try again',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //do handler stuff here
          }
        }
      ]
    });
    alert.present();
  }

}
