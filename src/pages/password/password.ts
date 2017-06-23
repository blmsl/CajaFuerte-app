import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})

export class PasswordPage {

  validationMessage: string;
  showValidationMessage: boolean = false;
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

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
	@Input('expanded') expanded;
	@Input('expandHeight') expandHeight;

	currentHeight: number = 0;

  constructor(
    public renderer: Renderer,
    public nav: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController,
    public iab: InAppBrowser,
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

  ngAfterViewInit(){
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', '40px');
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

    // Validate form data
    if (this.account.name === 'undefined' || this.account.name === '') {
      this.expanded = true;
      this.validationMessage = "Please enter account/password name"
      return;
    }
    
    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.addAccount(this.account);
    } else {
      this.auth.updateAccount(this.account, this.key);
    }
    this.nav.pop();
  }

  inputChange(account) {
    if (account != '') {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
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
      let browser = this.iab.create(url);
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