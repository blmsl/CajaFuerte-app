import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';

import { CajaFuerteApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ListMasterPage } from '../pages/list-master/list-master';
import { LoginPage } from '../pages/login/login';
import { LoginAutoPage } from '../pages/loginauto/loginauto';
import { LoginDemoPage } from '../pages/logindemo/logindemo';
import { ModalTouchIDPage } from '../pages/modaltouchid/modaltouchid';
import { PasswordPage } from '../pages/password/password';
import { PasswordEditPage } from '../pages/passwordedit/passwordedit';
import { PasswordsPage } from '../pages/passwords/passwords';
import { InsurancePage } from '../pages/insurance/insurance';
import { InsurancesPage } from '../pages/insurances/insurances';
import { DriverLicensesPage } from '../pages/driverlicenses/driverlicenses';
import { DriverLicensePage } from '../pages/driverlicense/driverlicense';
import { BankAccountsPage } from '../pages/bankaccounts/bankaccounts';
import { BankAccountPage } from '../pages/bankaccount/bankaccount';
import { CreditCardsPage, } from '../pages/creditcards/creditcards';
import { CreditCardPage, } from '../pages/creditcard/creditcard';
import { PickNotesPage } from '../pages/picknotes/picknotes';
import { RecentPage } from '../pages/recent/recent';
import { SearchPage } from '../pages/search/search';
import { SettingsPage } from '../pages/settings/settings';
import { PersonalProfilePage } from '../pages/personalprofile/personalprofile';
import { SignupPage } from '../pages/signup/signup';
import { TabsPage } from '../pages/tabs/tabs';
import { TouchIDPage } from '../pages/touchid/touchid';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { WelcomePage } from '../pages/welcome/welcome';
import { TakePhotoPage } from '../pages/takephoto/takephoto';

import { ChangeNamePage } from '../pages/myinfo/changename/changename';
import { ChangeEmailPage } from '../pages/myinfo/changeemail/changeemail';
import { ChangePasswordPage } from '../pages/myinfo/changepassword/changepassword';
import { PersonalProfilePhotoPage } from '../pages/myinfo/personalprofilephoto/personalprofilephoto';

import { AuthService } from '../providers/auth-service';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate/ng2-translate';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
  LoginDemoPage,
  SignupPage,
  TabsPage,
  TutorialPage,
  WelcomePage,
  ListMasterPage,
  SettingsPage,
  PersonalProfilePage,
  SearchPage,
  RecentPage,
  FavoritesPage,
  AboutPage,
  PasswordsPage,
  PasswordPage,
  InsurancePage,
  InsurancesPage,
  DriverLicensesPage,
  DriverLicensePage,
  BankAccountsPage,
  BankAccountPage,
  CreditCardsPage,
  CreditCardPage,
  PasswordEditPage,
  PickNotesPage,
  TouchIDPage,
  ModalTouchIDPage,
  ChangeNamePage,
  ChangeEmailPage,
  ChangePasswordPage,
  PersonalProfilePhotoPage,
  TakePhotoPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    Camera,
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
  projectId: "cajafuerte-2fbfb",
  storageBucket: "cajafuerte-2fbfb.appspot.com",
  messagingSenderId: "105460697119"
};

/*const firebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
}*/

@NgModule({
  declarations: declarations(),
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(CajaFuerteApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
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
