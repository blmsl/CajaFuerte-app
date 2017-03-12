import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods, FirebaseObjectObservable } from 'angularfire2';

import firebase from 'firebase';

import * as moment from 'moment';

@Injectable()
export class AuthService {
  
  private authState: FirebaseAuthState;
  private user;
  private userauth;
  private userdata;
  private formsdata;
  private vaultdata;
  private loading: any;
  public storageLang: string;
  public storageTouchid: boolean = false;
  public storageEmail: string;
  public storagePwd: string;

  public referrer: string;
  public pwdNotes: string;

  constructor(
    public storage: Storage,
    public translate: TranslateService, 
    public af: AngularFire, 
    public auth$: AngularFireAuth, 
    public loadingCtrl: LoadingController) {
    
    af.auth.subscribe(auth => {
      if(auth) {
        this.authState = auth;
      } else {
        console.log('not logged in');
      }
    });

    this.formsdata = firebase.database().ref('/forms/');
    this.userdata = firebase.database().ref('/users/');
    this.vaultdata = firebase.database().ref('/vaults/');

  }

  ngOnDestroy(){
    this.af.auth.unsubscribe();
    this.authState = null;
    this.user = null;
    this.userauth = null;
    this.userdata = null;
    this.formsdata = null;
    this.vaultdata = null;
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup
    });
  }

  signInWithEmail(credentials): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.auth$.login({email: credentials.email,password: credentials.password})
      .then((authData) => {
        this.userauth = authData;
        this.getUserData();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signUpWithEmail(credentials): firebase.Promise<FirebaseAuthState> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.auth$.createUser(credentials)
      .then((authData) => {
        this.userauth = authData;
        this.user = credentials;
        this.createInitialSetup();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signOut(): void {
    this.af.auth.unsubscribe();
    this.authState = null;
    this.user = null;
    this.userauth = null;
    this.userdata = null;
    this.formsdata = null;
    this.vaultdata = null;
    //this.af.auth.logout();
  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }

  getUserEmail(): string {
    let ref = this.af.auth.getAuth();
    return ref.auth.email;    
  }

  LoadingControllerShow() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...',
    });
    this.loading.present();
  }

  LoadingControllerDismiss() {
    // LUIS: Remove .catch once fix has been implemented
    // https://github.com/driftyco/ionic/issues/10046#issuecomment-274074432
    //this.loading.dismiss().catch(() => console.log('error on dismiss'));
    this.loading.dismiss();
  }

  storageSetLanguage(lang) {
    this.storageLang = lang;
    this.storage.set('option0', lang);
  }
  storageSet(isenabled, pwd, email) {
    this.storageTouchid = isenabled;
    this.storagePwd = pwd;
    this.storageEmail = email;
    this.storage.set('option1', isenabled);
    this.storage.set('option2', pwd);
    this.storage.set('option3', email);
  }
  storageClean() {
    this.storageTouchid = false;
    this.storagePwd = '';
    this.storageEmail = '';
    this.storage.set('option1', false);
    this.storage.set('option2', '');
    this.storage.set('option3', '');
  }

  //
  // SING IN - CREATE USER
  //-----------------------------------------------------------------------
  createInitialSetup() {
    this.createUserProfile();
    this.createVault();
    //this.createForms();
  }

  createUserProfile() {

    // Save basic user profile
    var profile = {
      datecreated: moment().valueOf(),
      defaultbalance: 'Current',
      defaultdate: 'None',
      email: this.user.email,
      enabletouchid: 'false',
      fullname: this.user.name,
      nickname: this.user.name,
      profilepic: 'http://www.gravatar.com/avatar?d=mm&s=140',
      paymentplan: 'Free'
    };
    this.user.enabletouchid = profile.enabletouchid;
    this.user.profilepic = profile.profilepic;
    
    // Save user profile
    this.userdata.child(this.userauth.uid).update(profile);
  }

  createVault() {

    // Set basic vault defaults
    var vaultuser = {
        isadmin: true,
        createdby: this.user.email,
        dateCreated: moment().valueOf(),
    };

    // Create node under houses and get the key
    this.user.vaultid = this.vaultdata.push().key;

    // Save key into the user->houseid node 
    this.userdata.child(this.userauth.uid).update({vaultid : this.user.vaultid});

    // Add member to housemembers node under Houses
    this.vaultdata.child(this.user.vaultid + "/vaultusers/" + this.userauth.uid).update(vaultuser);

  }

  /*createForms() {

    var ref = this.formsdata.child(this.user.vaultid + "/forms/");
    ref.push({ component: 'PasswordPage', icon: 'fa fa-lock', color: '#fecd57' });
    ref.push({ component: 'DriverLicensePage', icon: 'fa fa-lock', color: '#fecd57' });
    ref.push({ component: 'PasswordPage', icon: 'fa fa-lock', color: '#fecd57' });

  }*/

  getUserData() { 
    const thisuser$ : FirebaseObjectObservable<any> = this.af.database.object('/users/' + this.userauth.uid); 
    thisuser$.subscribe((val) => {
      this.user = val;
    });
  }

  //
  // RECENT
  //-----------------------------------------------------------------------
  handleRecent(sourcekey, item, component) {

    let recent: {name: string, sourcekey: string, component: string, icon: string, color: string, dateCreated: number} = {
      name: item.name, 
      sourcekey: sourcekey,
      component: component, 
      icon: 'fa fa-lock',
      color: 'fa-color', 
      dateCreated: moment().valueOf()
    };

    // Test for the existence of a Recent item within our data. If not found, add it
    if (item.recentid === undefined || item.recentid === '') {
      this.addRecentItem(sourcekey, recent, component);
      return;
    }

    // We have a recent item in our database, update timestamp
    this.vaultdata.child(this.user.vaultid + '/recent/' + item.recentid).update(recent);
  }

  addRecentItem(sourcekey, recent, component) {

    // Create node under Recent and get the key
    let recentKey = this.vaultdata.child(this.user.vaultid + '/recent/').push().key;

    // Save key into the account node 
    switch(component) {
			case 'PasswordPage': 
        this.vaultdata.child(this.user.vaultid + '/accounts/' + sourcekey).update({ recentid : recentKey });
        break;
      case 'DriverLicensePage': 
        this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + sourcekey).update({ recentid : recentKey });
        break;
		}

    // Save recent account
    this.vaultdata.child(this.user.vaultid + '/recent/' + recentKey + '/').update(recent);
  }

  getRecent() {
    return this.vaultdata.child(this.user.vaultid + '/recent/').orderByChild('dateCreated');
  }

  //
  // FAVORITES
  //-----------------------------------------------------------------------
  handleFavorites(item) {

    /*let fav: {key: string, name: string, component: string, icon: string, color: string, dateCreated: number} = {
      key: item.$key, 
      name: item.name, 
      component: 'PasswordPage', 
      icon: 'fa fa-lock',
      color: 'fa-color', 
      dateCreated: moment().valueOf()
    };

    // Test for the existence of a Recent item within our data. If not found, add it
    if (item.recentid === undefined || item.recentid === '') {
      this.addRecentItem(item, fav)
      return;
    }

    // We have a recent item in our database, update timestamp
    this.vaultdata.child(this.user.vaultid + '/recent/' + item.recentid).update({
      dateCreated: moment().valueOf()
    });*/
    
  }

  addFavoriteItem(item, recent) {
    /*// Create node under Recent and get the key
    let recentKey = this.vaultdata.child(this.user.vaultid + '/recent/').push().key;

    // Save key into the account node 
    this.vaultdata.child(this.user.vaultid + '/accounts/' + item.$key).update({ recentid : recentKey });

    // Save recent account
    this.vaultdata.child(this.user.vaultid + '/recent/' + recentKey + '/').update(recent);*/
  }

  getFavorites() {
    return this.vaultdata.child(this.user.vaultid + '/favorites/');
  }

  //
  // ACCOUNTS - PASSWORDS
  //-----------------------------------------------------------------------  
  getAllAccounts() {
    return this.vaultdata.child(this.user.vaultid + '/accounts').orderByChild('namelower');
  }
  
  getAccount(key) {
    return this.vaultdata.child(this.user.vaultid + '/accounts/' + key);
  }

  addAccount(account) {
    this.vaultdata.child(this.user.vaultid + "/accounts/").push(account);
  }

  deleteAccount(account) {
    this.vaultdata.child(this.user.vaultid + '/accounts/' + account.$key).remove();
  }

  updateAccount(account, key) {
    this.vaultdata.child(this.user.vaultid + '/accounts/' + key).update({
      name: account.name, 
      namelower: account.namelower, 
      site: account.site, 
      number: account.number, 
      username: account.username, 
      password: account.password, 
      description: account.description,
      notes: account.notes
    });
  }

  //
  // DRIVER LICENSES - IDs
  //-----------------------------------------------------------------------  
  getAllDriverLicenses() {
    return this.vaultdata.child(this.user.vaultid + '/driverlicenses').orderByChild('namelower');
  }
  
  getDriverLicense(key) {
    return this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + key);
  }

  AddDriverLicense(dl) {
    this.vaultdata.child(this.user.vaultid + "/driverlicenses/").push(dl);
  }

  deleteDriverLicense(dl) {
    this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + dl.$key).remove();
  }

  updateDriverLicense(dl, key) {
    this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + key).update({
      name: dl.name, 
      namelower: dl.namelower, 
      number: dl.number, 
      issuedate: dl.issuedate, 
      expirationdate: dl.expirationdate, 
      state: dl.state, 
      notes: dl.notes, 
      photo: dl.photo,
      recentid: dl.recentid
    });
  }

}