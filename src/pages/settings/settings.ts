import { Component } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';

import { AboutPage } from '../../pages/about/about';
import { TouchIDPage } from '../../pages/touchid/touchid';
import { PersonalProfilePage } from '../../pages/personalprofile/personalprofile';

import { AuthService } from '../../providers/auth-service';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  showFeature: boolean = false;
  appversion: string = '';
  buildversion: string = '';
  language: string = 'en';
  mode: string = '';
  profile: {fullname: string, email: string, vaultnumber: string, paymentplan: string, touchid: boolean} = {
    fullname: '', 
    email: '', 
    vaultnumber: '', 
    paymentplan: 'Free',
    touchid: false
  };

  constructor(public platform: Platform,
    public nav: NavController,
    public translate: TranslateService,
    public auth: AuthService) {
      
     platform.ready().then(() => {
      AppVersion.getVersionNumber().then(ver => {
        this.appversion = ver;
      }).catch(err => {
        console.log(err);
      });
      AppVersion.getVersionCode().then( build => {
        this.buildversion = build;
      }).catch(err => {
        console.log(err);
      })
    });

  }

  openTouchID() {
    this.nav.push(TouchIDPage);
  }

  toggleSelect(e) {
    this.auth.storageSetLanguage(e);
    this.translate.use(e);
  }

  openAboutPage() {
    this.nav.push(AboutPage);
  }

  openPersonalProfile() {
    this.nav.push(PersonalProfilePage, {paramSettings: this.auth.user});
  }
  
}
