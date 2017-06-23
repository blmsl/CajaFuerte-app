import { Component, ViewChild } from '@angular/core';

import { Platform, Nav, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Deploy } from '@ionic/cloud-angular';

import { StatusBar, Splashscreen, TouchID } from 'ionic-native';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../providers/auth-service';
import { SmartAudio } from '../providers/smart-audio';

import { FirstRunPage } from '../pages/pages';
import { LoginAutoPage } from '../pages/loginauto/loginauto';

@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})

export class CajaFuerteApp {
  
  rootPage = FirstRunPage;
  isTouchId: boolean = false;

  @ViewChild(Nav) nav: Nav;

  constructor(
    smartAudio: SmartAudio,
    translate: TranslateService, 
    platform: Platform,
    public deploy: Deploy,
    public alertCtrl: AlertController,
    public storage: Storage,
    public auth: AuthService) {

    // Set the default language for translation strings, and the current language
    translate.setDefaultLang('en');
    translate.use('en')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
      Splashscreen.hide();

      // Enable audio
      smartAudio.preload('tabSwitch', 'assets/audio/clickSound.mp3');

      // Get local storage saved settings
      storage.ready().then(() => {
        this.storage.get('option1').then( touchid => {
          this.isTouchId = touchid;
          if (this.isTouchId) {
            console.log('try touchid');
            this.signInWithTouchID();
          } else {
            console.log('touchid not enabled');
          }
        })      
      });
    });

  }

  signInWithTouchID() {
    //
    // Check if TouchID is supported
    console.log('signin touchid');
    TouchID.isAvailable()
    .then(
      res => {
        TouchID.verifyFingerprint('Scan your fingerprint please')
        .then(
          res => {
            this.nav.setRoot(LoginAutoPage);
          },
          err => {console.error('Error', err)}
        );
      },
      err => {
        console.error('TouchID is not available', err)
      }
    );
    // testing
    // this.nav.setRoot(LoginAutoPage);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    let alert = this.alertCtrl.create({
      title: 'Sign Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel RemoveUser clicked');
          }
        },
        {
          text: 'Sign Out',
          handler: () => {
            try {
              this.auth.signOut();
            } catch(error){
              console.log(error);
            }            
            this.nav.setRoot(FirstRunPage, {}, {animate: true, direction: 'forward'});
          }
        }
      ]
    });
    alert.present();
  }
  
}
