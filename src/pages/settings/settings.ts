import { Component } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { EmailComposer } from '@ionic-native/email-composer';

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
  ver: string = '';
  language: string = 'en';
  mode: string = '';
  profile: {fullname: string, email: string, vaultnumber: string, paymentplan: string, touchid: boolean} = {
    fullname: '', 
    email: '', 
    vaultnumber: '', 
    paymentplan: 'Free',
    touchid: false
  };

  constructor(
    public platform: Platform,
    public nav: NavController,
    public appVersion: AppVersion,
    public emailComposer: EmailComposer,
    public translate: TranslateService,
    public auth: AuthService) {

     platform.ready().then(() => {
      this.appVersion.getVersionNumber().then(ver => {
        
        // Get version number
        this.appversion = ver;

        this.appVersion.getVersionCode().then( build => {
          
          // Get build number
          this.buildversion = build;

          this.ver = this.appversion + '(' + this.buildversion + ')';

        }).catch(err => {
          console.log(err);
        })

      }).catch(err => {
        console.log(err);
      });
    });

  }

  reportBug() {
    let email = {
      to: 'cajafuerteapp@outlook.com',
      subject: 'Report a Bug',
      body: 'I found a bug...',
      isHtml: true
    }
    this.emailComposer.open(email);
  }

  suggestFeature() {
    let email = {
      to: 'cajafuerteapp@outlook.com',
      subject: 'Suggesting a Feature',
      body: 'I want to suggest a feature for CajaFuerte...',
      isHtml: true
    }
    this.emailComposer.open(email);
  }

  contactSupport() {
    let email = {
      to: 'cajafuerteapp@outlook.com',
      subject: 'I need support',
      body: 'I have a problem with CajaFuerte and I need support...',
      isHtml: true
    }
    this.emailComposer.open(email);
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
