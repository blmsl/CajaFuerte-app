import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { MainPage } from '../../pages/pages';

import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-logindemo',
  templateUrl: 'logindemo.html'
})

export class LoginDemoPage {

  pwd: string;
  email: string;
  account: {email: string, password: string} = {
    email: 'luis@example.com',
    password: 'test123'
  };

  constructor(public nav: NavController, public auth: AuthService) {

      this.auth.LoadingControllerShow();
      this.account = { email: this.account.email, password: this.account.password };
      this.autoLogin(this.account);
      
    }

    autoLogin(credentials) {
      this.auth.signInWithEmail(credentials)
      .then(() => {
          this.LoginSuccess();
        }        
      )
      .catch(
        (error) => {
          this.LoginFailure();
        }
      );
    }

    LoginSuccess() {
      setTimeout(() => {
        this.nav.setRoot(MainPage, {}, {animate: true, direction: 'forward'});
      }, 1000);
    }

    LoginFailure() {
      this.nav.setRoot(LoginPage);
      this.auth.LoadingControllerDismiss();
    }

}