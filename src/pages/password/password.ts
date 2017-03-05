import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

import {InAppBrowser} from 'ionic-native';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'password.html'
})

export class PasswordPage {

  title: string;
  lockicon: string;
  showSkip = false;
  mode: string;
  acc;
  account: {name: string, namelower: string, site: string, number: string, username: string, password: string, description: string, notes: string} = {
    name: '', 
    namelower: '', 
    site: '', 
    number: '', 
    username: '', 
    password: '', 
    description: '',
    notes: ''
  };

  constructor(
    public nav: NavController, 
    public modalController: ModalController, 
    public navParams: NavParams, 
    public translate: TranslateService,
    public auth: AuthService) {

    this.acc = navParams.get('account');

    translate.get(["EDIT_PASSWORD_TITLE","CREATE_PASSWORD_TITLE"])
    .subscribe((values) => {
      
      if (this.acc === undefined) {
        this.title = values.CREATE_PASSWORD_TITLE;
        this.mode = "New";
      } else {
        this.account = Object.assign({}, this.acc);
        this.title = values.EDIT_PASSWORD_TITLE + this.account.name;
        this.mode = "Edit";
      }

    });
    this.lockicon = 'lock';

  }

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'PasswordsPage': {
        this.auth.pwdNotes = '';
        break;
      }
      case 'PickNotesPage': {
        this.account.notes = this.auth.pwdNotes;
        break;
      }
    }
  }

  save() {
    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.addAccount(this.account);
    } else {
      this.auth.updateAccount(this.account, this.acc.$key);
    }
    this.nav.pop();
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.lockicon = input.type === 'password' ?  'lock' : 'unlock-alt faRed';
  }

  openSite(): any {
    if (this.account.site != '') {
      let urlLower = this.account.site.toLowerCase();
      let url: string;
      if (urlLower.startsWith('http://') || urlLower.startsWith('https://')) {
        url = urlLower;
      } else {
        url = 'http://' + urlLower;
      }
      let options = 'location=yes,toolbar=yes,hidden=no';
      let browser = new InAppBrowser(url, '_blank', options);
      browser.show();
    }
  }

  pickNotes() {
    this.auth.pwdNotes = this.account.notes;
    this.nav.push(PickNotesPage);
  }
  
}