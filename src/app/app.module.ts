import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';

import { CajaFuerteApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { LoginAutoPage } from '../pages/loginauto/loginauto';
import { ModalTouchIDPage } from '../pages/modaltouchid/modaltouchid';
import { PasswordPage } from '../pages/password/password';
import { PasswordEditPage } from '../pages/passwordedit/passwordedit';
import { PasswordsPage } from '../pages/passwords/passwords';
import { DriverLicensesPage } from '../pages/driverlicenses/driverlicenses';
import { DriverLicensePage } from '../pages/driverlicense/driverlicense';
import { PickNotesPage } from '../pages/picknotes/picknotes';
import { RecentPage } from '../pages/recent/recent';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TouchIDPage } from '../pages/touchid/touchid';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';

import { AuthService } from '../providers/auth-service';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

import 'gsap';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
}

/**
 * The Pages array lists all of the pages we want to use in our app.
 * We then take these pages and inject them into our NgModule so Angular
 * can find them. As you add and remove pages, make sure to keep this list up to date.
 */
let pages = [
  CajaFuerteApp,
  LoginPage,
  LoginAutoPage,
  SignupPage,
  TabsPage,
  TutorialPage,
  WelcomePage,
  ListMasterPage,
  SettingsPage,
  SearchPage,
  RecentPage,
  FavoritesPage,
  AboutPage,
  PasswordsPage,
  PasswordPage,
  DriverLicensesPage,
  DriverLicensePage,
  PasswordEditPage,
  PickNotesPage,
  TouchIDPage,
  ModalTouchIDPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Storage,
    AuthService,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '7a8e133b'
  }
};

// YOUR FIREBASE SETTINGS GO HERE!
export const firebaseConfig = {
  apiKey: "AIzaSyAWLtjIAOfBRD0tHWU899mE9vwVJEv5mRQ",
  authDomain: "cajafuerte-2fbfb.firebaseapp.com",
  databaseURL: "https://cajafuerte-2fbfb.firebaseio.com",
  storageBucket: "cajafuerte-2fbfb.appspot.com",
  messagingSenderId: "105460697119"
};

const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(CajaFuerteApp),
    AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
    CloudModule.forRoot(cloudSettings),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
