import { Component } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';
import { AppVersion } from 'ionic-native';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AboutPage } from '../../pages/about/about';
import { TouchIDPage } from '../../pages/touchid/touchid';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  showFeature: boolean = false;
  appversion = '';
  language = 'en';
  mode: string;
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
      }).catch(function(error) {
        console.log(error);
      });
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
  
}
