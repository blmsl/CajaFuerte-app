import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  templateUrl: 'password.html'
})

export class PasswordPage {

  mode: string;
  account: {name: string, site: string, number: string, username: string, password: string, description: string} = {
    name: '', 
    site: '', 
    number: '', 
    username: '', 
    password: '', 
    description: ''
  };
  title: string;

  constructor(public nav: NavController, public modalController: ModalController,public navParams: NavParams,public auth: AuthService) {   
    if (navParams.get('account') === undefined) {
      this.title = "Create Account";
      this.mode = "New";
    } else {
      this.account = navParams.get('account');
      this.title = "Edit " + this.account.name;
      this.mode = "Edit";
    }    
  }

  save() {

    if (this.mode === 'New') {
      this.auth.addAccount(this.account);
    } else {
      this.auth.updateAccount(this.account);
    }
    this.nav.pop();
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
  }

  openSite(): any {
    if (this.account.site != '') {
      window.open(this.account.site, '_blank');
    }
  }
  
}