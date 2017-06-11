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
    email: '',
    password: ''
  };

  // Our translated text strings
  private loginErrorString: string;
  private loginErrorTitle: string;

  constructor(public navCtrl: NavController,
              public alertController: AlertController,
              public auth: AuthService,
              public translateService: TranslateService) {

    this.translateService.get('LOGIN_ERROR').subscribe((value) => {
      this.loginErrorString = value;
    })
    this.translateService.get('LOGIN_ERROR_TITLE').subscribe((value) => {
      this.loginErrorTitle = value;
    })
  }

  // Attempt to login in through our User service
  doLogin() {

    // Show loading control
    this.auth.LoadingControllerShow();

    // Authenticate user
    this.auth.signInWithEmail(this.account).then(() => {
      this.navCtrl.setRoot(MainPage, {}, {animate: true, direction: 'forward'});
    }).catch((error) => {
      // If there's an error, dismiss loading control and display error message
      this.auth.LoadingControllerDismiss();
      this.LoginError(this.loginErrorTitle, this.loginErrorString);
    });

  }

  LoginError(title, error) {
    let alert = this.alertController.create({
      title: title,
      subTitle: error,
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
