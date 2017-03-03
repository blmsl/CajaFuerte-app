import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

import firebase from 'firebase';

import * as moment from 'moment';

@Injectable()
export class AuthService {
  
  private authState: FirebaseAuthState;
  private user;
  private userauth;
  private userdata;
  private vaultdata;
  private loading: any;

  public referrer: string;
  public pwdNotes: string;

  constructor(
    public storage: Storage,
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

    this.userdata = firebase.database().ref('/users/');
    this.vaultdata = firebase.database().ref('/vaults/');
  }

  ngOnDestroy(){
    this.af.auth.unsubscribe();
    this.authState = null;
    this.user = null;
    this.userauth = null;
    this.userdata = null;
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

  storageSet(isenabled, pwd, email) {
    this.storage.set('option1', isenabled);
    this.storage.set('option2', pwd);
    this.storage.set('option3', email);
  }
  storageClean() {
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

    var ref = this.vaultdata.child(this.user.vaultid + "/forms/");
    ref.push({ title: 'Accounts / Passwords', icon: 'fa fa-lock', color: '#fecd57' });
    ref.push({ title: 'Savings', icon: 'ios-cash-outline' });
    ref.push({ title: 'Credit Card', icon: 'ios-cash-outline' });
    ref.push({ title: 'Debit Card', icon: 'ios-cash-outline' });
    ref.push({ title: 'Investment', icon: 'ios-cash-outline' });
    ref.push({ title: 'Brokerage', icon: 'ios-cash-outline' });
  }*/

  getUserData() { 
    const thisuser$ : FirebaseObjectObservable<any> = this.af.database.object('/users/' + this.userauth.uid); 
    thisuser$.subscribe((val) => {
      this.user = val;
    });
  }

  //
  // ACCOUNTS - PASSWORDS
  //-----------------------------------------------------------------------
  getAccounts(): FirebaseListObservable<any[]> {
    return this.af.database.list('/vaults/' + this.user.vaultid + '/accounts', {
      query: {
        orderByChild: 'namelower'
      }
    });
  }
  
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

}