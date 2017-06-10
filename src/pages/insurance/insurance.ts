import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import {InAppBrowser} from 'ionic-native';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'insurance.html'
})

export class InsurancePage {

  title: string;
  lockicon: string;
  showSkip = false;
  mode: string;
  key: string;
  account: {name: string, namelower: string, recentid: string, site: string, number: string, username: string, password: string, description: string, notes: string} = {
    name: '', 
    namelower: '', 
    recentid: '', 
    site: '', 
    number: '', 
    username: '', 
    password: '', 
    description: '',
    notes: ''
  };

  constructor(
    public nav: NavController, 
    public navParams: NavParams, 
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    translate.get(["EDIT_TITLE","CREATE_INSURANCE_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_INSURANCE_TITLE;
        this.mode = "New";
      } else {
        this.auth.getAccount(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();
          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'PasswordPage');
        });
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
        this.auth.pwdNotes = '';
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
      this.auth.updateAccount(this.account, this.key);
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