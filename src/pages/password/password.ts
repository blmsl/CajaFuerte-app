import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

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
  showpwd: boolean = false;
  mode: string;
  key: string;
  isFav: boolean = false;
  account: {name: string, namelower: string, recentid: string, favoriteid: string, site: string, number: string, username: string, password: string, description: string, notes: string} = {
    name: '', 
    namelower: '', 
    recentid: '', 
    favoriteid: '',
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
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    translate.get(["EDIT_TITLE","CREATE_PASSWORD_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_PASSWORD_TITLE;
        this.mode = "New";
      } else {
        this.auth.getAccount(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();
          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.account.favoriteid = this.account.favoriteid === undefined ?  '' : this.account.favoriteid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'PasswordPage');
          // Handle Favorites
          this.isFav = this.account.favoriteid === '' ?  false : true;
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

  showPassword(pwinput: any): any {
    this.showpwd = !this.showpwd;
    this.lockicon = this.showpwd ?  'unlock-alt faRed' : 'lock';
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

  favorite() {
    if (this.isFav) {
      // This is already a favorite item - DELETE IT
      this.auth.deleteFavorite(this.key, this.account.favoriteid, 'PasswordPage');
      this.isFav = false;
      this.alertRemovedFav();
    } else {
      this.auth.handleFavorites(this.key, this.account, 'PasswordPage');
      this.isFav = true;
      this.alertAddedFav();
    }
  }

  alertAddedFav() {
    // create an alert instance
    let alert = this.alertCtrl.create({
      title: 'Favorite Added',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();
  }

  alertRemovedFav() {
    // create an alert instance
    let alert = this.alertCtrl.create({
      title: 'Favorite Removed',
      buttons: [{
        text: 'OK',
        handler: () => {
          // close the sliding item
        }
      }]
    });
    // now present the alert on top of all other content
    alert.present();
  }
  
  
}