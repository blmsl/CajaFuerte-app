import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

import {InAppBrowser} from 'ionic-native';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

@Component({
  templateUrl: 'password.html'
})

export class PasswordPage {

  mode: string;
  account: {name: string, site: string, number: string, username: string, password: string, description: string, notes: string} = {
    name: '', 
    site: '', 
    number: '', 
    username: '', 
    password: '', 
    description: '',
    notes: ''
  };
  title: string;
  lockicon: string;

  constructor(public nav: NavController, public modalController: ModalController, public navParams: NavParams, public auth: AuthService) {
    if (navParams.get('account') === undefined) {
      this.title = "Create Account";
      this.mode = "New";
    } else {
      this.account = navParams.get('account');
      this.title = "Edit " + this.account.name;
      this.mode = "Edit";
    }
    this.lockicon = 'lock';
  }

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'PickNotesPage': {
        // Payee
        this.account.notes = this.auth.pwdNotes;
        break;
      }
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
    this.lockicon = input.type === 'password' ?  'lock' : 'unlock-alt';
  }

  openSite(): any {
    if (this.account.site != '') {
      let urlLower = this.account.site.toLowerCase();
      let url = urlLower.startsWith('http://') ?  urlLower : 'http://' + urlLower;
      let options = 'location=yes,toolbar=yes,hidden=no';
      let browser = new InAppBrowser(url, '_blank', options);
      browser.show();
    }
  }

  pickNotes() {
    /*if (!this.hasDataTransactionType) {
      // Make sure a transaction type has been selected
      this.showValidationMessage = true;
      this.validationMessage = "Please select Transaction Type";
      return;
    }*/
    this.nav.push(PickNotesPage);
  }
  
}