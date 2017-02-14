import { Component, ViewChild } from '@angular/core';

import { Platform, Nav, AlertController } from 'ionic-angular';

import {Deploy} from '@ionic/cloud-angular';

import { StatusBar, Splashscreen } from 'ionic-native';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AuthService } from '../providers/auth-service';

import { FirstRunPage } from '../pages/pages';
import { ListMasterPage } from '../pages/list-master/list-master';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar color="cfblack">
        <ion-title>CajaFuerte</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="outer-content">
      <ion-list>
        <ion-list-header>
          Navigate
        </ion-list-header>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          <ion-icon item-left [name]="p.icon" [ngStyle]="{'color':p.color}" class="mlmenuicon"></ion-icon>
          <span class="mlmenuitem">{{p.title}}</span>
        </button>
      </ion-list>

      <ion-list>
        <ion-list-header>
          Account
        </ion-list-header>
        <button menuClose ion-item (click)="logout()">
          <ion-icon item-left name="md-log-out" color="danger"></ion-icon>
          <span class="mlmenuitem">Sign Out</span>
        </button>
      </ion-list>
      
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})

export class CajaFuerteApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Forms', component: ListMasterPage, icon: 'ios-browsers-outline', color: '' },
    { title: 'Settings', component: SettingsPage, icon: 'ios-settings-outline', color: '' }
  ]

  constructor(
    translate: TranslateService, 
    platform: Platform,
    public deploy: Deploy,
    public alertCtrl: AlertController,
    public auth: AuthService) {

    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleLightContent();
      Splashscreen.hide();
    });
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
          text: 'Sing Out',
          cssClass: 'alertDanger',
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
