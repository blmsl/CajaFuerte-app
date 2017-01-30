import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Settings } from '../providers/providers';

import { FirstRunPage } from '../pages/pages';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  template: `<ion-nav #content [root]="rootPage"></ion-nav>`
})
export class CajaFuerteApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  constructor(translate: TranslateService, platform: Platform, settings: Settings) {
    // Set the default language for translation strings, and the current language.
    translate.setDefaultLang('en');
    translate.use('en')

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
