import { Component } from '@angular/core';

import { NavController, MenuController } from 'ionic-angular';

import { LoginPage } from '../login/login';

import { LoginDemoPage } from '../logindemo/logindemo';

import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {}

  login() {
    this.navCtrl.push(LoginPage);
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  demo() {
    this.navCtrl.push(LoginDemoPage);
  }

}
