import { Injectable } from '@angular/core';

import { LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

import * as moment from 'moment';

@Injectable()
export class AuthService {
  
  private authState;
  private userauth;
  private userdata;
  private formsdata;
  private vaultdata;
  private profilepicdata;
  private vaultpicdata;
  private loading: any;
  
  public user;
  public storageLang: string;
  public storageTouchid: boolean = false;
  public storageEmail: string;
  public storagePwd: string;
  public referrer: string;
  public pwdNotes: string;
  pages: Array<{id: string, title: string, component: any, icon: string, color: string}>;

  constructor(
    public storage: Storage,
    public afAuth: AngularFireAuth, 
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController) {
    
    this.authState = afAuth.authState;

    this.formsdata = firebase.database().ref('/forms/');
    this.userdata = firebase.database().ref('/users/');
    this.vaultdata = firebase.database().ref('/vaults/');
    this.profilepicdata = firebase.storage().ref().child('/profilepics/');
    this.vaultpicdata = firebase.storage().ref().child('/vaultpics/');
    //
    // Load default forms
    //
    this.pages = [
      {id: '1', title: '', component: '', icon: 'fa-lock', color: 'cf-fa-color1'},
      {id: '2', title: '', component: '', icon: 'fa-id-card-o', color: 'cf-fa-color2'},
      {id: '3', title: '', component: '', icon: 'fa-credit-card', color: 'cf-fa-color3'},
      {id: '4', title: '', component: '',icon: 'fa-university', color: 'cf-fa-color4'}
      /*{id: '5', title: '', component: '', icon: 'fa-umbrella', color: 'cf-fa-color5'}*/
    ];
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signInWithEmail(credentials): firebase.Promise<any> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((authData) => {
        this.userauth = authData;
        this.getUserData();
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  signUpWithEmail(credentials): firebase.Promise<any> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password)
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
    this.authState = null;
    this.user = null;
    this.userauth = null;
    this.userdata = null;
    this.formsdata = null;
    this.vaultdata = null;
  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }

  getUserEmail(): string {
    let user = firebase.auth().currentUser;
    return user.email;
  }

  LoadingControllerShow() {
    this.loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Please wait...',
    });
    this.loading.present();
  }

  LoadingControllerDismiss() {
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
  storageSetEmail(email) {
    this.storageEmail = email;
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

  //
  // DEFAULT GLOBAL FORMS
  //-----------------------------------------------------------------------
  getDefaultForms() {
    return this.pages;
  }

  searchForms(nameKey) {
    this.searchArray(nameKey, this.pages);
  }
  
  searchArray(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  //
  // PERSONAL PROFILE
  //-----------------------------------------------------------------------

  getUserData() { 
    const thisuser$ : FirebaseObjectObservable<any> = this.db.object('/users/' + this.userauth.uid); 
    thisuser$.subscribe((val) => {
      this.user = val;
    });
  }

  updateName(newname: string) {
    this.userdata.child(this.userauth.uid).update({'fullname' : newname});
  }

  updateEmail(newEmail: string) {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.updateEmail(newEmail)
      .then(function() {
        this.user.email = newEmail;
        this.updateEmailNode(newEmail);
        resolve();
      }).catch(error => {
        reject(error);
      });
    });
  }

  updatePassword(newPassword: string) {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.updatePassword(newPassword)
      .then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  deleteData() {
    //
    // Delete ALL user data
    this.vaultdata.child(this.user.vaultid).remove();
    this.userdata.child(firebase.auth().currentUser.uid).remove();
  }

  deleteUser() {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      let user = firebase.auth().currentUser;
      user.delete()
      .then(function() {
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  saveProfilePicture(pic) {
    this.profilepicdata.child(firebase.auth().currentUser.uid).child('profilepicture.png')
    .putString(pic, 'base64', {contentType: 'image/png'}).then((savedpicture) => {
      this.userdata.child(firebase.auth().currentUser.uid).update({'profilepic' : savedpicture.downloadURL});
    });
  }

  savePhoto(pic, source) {

    switch (source) {
      case 'DriverLicensePage': {
        this.vaultpicdata.child(firebase.auth().currentUser.uid + '/driverlicensephotos/').child(moment().valueOf())
        .putString(pic, 'base64', {contentType: 'image/png'}).then((savedphoto) => {
          this.vaultdata.child(this.user.vaultid + "/driverlicenses/photos/").push({'photourl' : savedphoto.downloadURL});
        });        
        break;
      }
      case 'CreditCardPage': {
        this.vaultpicdata.child(firebase.auth().currentUser.uid + '/creditcardphotos/').child(moment().valueOf())
        .putString(pic, 'base64', {contentType: 'image/png'}).then((savedphoto) => {
          this.vaultdata.child(this.user.vaultid + "/creditcards/photos/").push({'photourl' : savedphoto.downloadURL});
        });
        break;
      }
    }

  }

  updateEmailNode(newemail) {
    this.userdata.child(this.userauth.uid).update({'email' : newemail});
  }

  //
  // RECENT
  //-----------------------------------------------------------------------
  handleRecent(sourcekey, account, component) {

    let recent: {name: string, sourcekey: string, component: string, dateCreated: number} = {
      name: account.name, 
      sourcekey: sourcekey,
      component: component,
      dateCreated: moment().valueOf()
    };

    // Test for the existence of a Recent item within our data. If not found, add it
    if (account.recentid === undefined || account.recentid === '') {
      this.addRecentItem(sourcekey, recent, component);
      return;
    }

    // We have a recent item in our database, update timestamp
    this.vaultdata.child(this.user.vaultid + '/recent/' + account.recentid).update(recent);
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
      case 'BankAccountPage':
        this.vaultdata.child(this.user.vaultid + '/bankaccounts/' + sourcekey).update({ recentid : recentKey });
        break;
      case 'CreditCardPage':
        this.vaultdata.child(this.user.vaultid + '/creditcards/' + sourcekey).update({ recentid : recentKey });
        break;
		}

    // Save recent account
    this.vaultdata.child(this.user.vaultid + '/recent/' + recentKey + '/').update(recent);
  }

  getRecent() {
    return this.vaultdata.child(this.user.vaultid + '/recent/').orderByChild('dateCreated');
  }

  deleteRecent() {
    this.vaultdata.child(this.user.vaultid + '/recent/').remove();
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

  addAccount(item) {
    this.vaultdata.child(this.user.vaultid + "/accounts/").push(item);
  }

  deleteAccount(item) {
    this.vaultdata.child(this.user.vaultid + '/accounts/' + item.$key).remove();
  }

  updateAccount(item, key) {
    this.vaultdata.child(this.user.vaultid + '/accounts/' + key).update({
      name: item.name, 
      namelower: item.namelower, 
      site: item.site, 
      number: item.number, 
      username: item.username, 
      password: item.password, 
      description: item.description,
      notes: item.notes
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
  
  getDriverLicensePhotos(key) {
    return this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + key + '/photos/');
  }

  getDriverLicensePhotosRef(key) {
    var ref = this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + key + '/photos/');
    return ref;
  }

  AddDriverLicense(item) {
    this.vaultdata.child(this.user.vaultid + "/driverlicenses/").push(item);
  }

  deleteDriverLicense(item) {
    this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + item.$key).remove();
  }

  deleteDriverLicensePhoto(licensekey, photo) {
    this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + licensekey + '/photos/' + photo.$key).remove();
    var picRef = firebase.storage().refFromURL(photo.photourl);
    picRef.delete().then(function() {
      // File deleted successfully
    }).catch(function(error) {
      // Uh-oh, an error occurred!
      console.log(error);
    });
  }

  updateDriverLicense(item, key) {
    this.vaultdata.child(this.user.vaultid + '/driverlicenses/' + key).update({
      name: item.name, 
      namelower: item.namelower, 
      number: item.number, 
      issuedate: item.issuedate, 
      expirationdate: item.expirationdate, 
      state: item.state, 
      notes: item.notes,
      recentid: item.recentid
    });
  }

  //
  // BANK ACCOUNTS
  //-----------------------------------------------------------------------  
  getAllBankAccounts() {
    return this.vaultdata.child(this.user.vaultid + '/bankaccounts').orderByChild('namelower');
  }
  
  getBankAccount(key) {
    return this.vaultdata.child(this.user.vaultid + '/bankaccounts/' + key);
  }

  AddBankAccount(item) {
    this.vaultdata.child(this.user.vaultid + "/bankaccounts/").push(item);
  }

  deleteBankAccount(item) {
    this.vaultdata.child(this.user.vaultid + '/bankaccounts/' + item.$key).remove();
  }

  updateBankAccount(item, key) {
    this.vaultdata.child(this.user.vaultid + '/bankaccounts/' + key).update({
      name: item.name, 
      namelower: item.namelower, 
      accounttype: item. accounttype,
      number: item.number, 
      routingnumber: item. routingnumber,
      owner: item.owner, 
      notes: item.notes,
      recentid: item.recentid
    });
  }

  //
  // CREDIT CARDS
  //-----------------------------------------------------------------------  
  getAllCreditCards() {
    return this.vaultdata.child(this.user.vaultid + '/creditcards').orderByChild('namelower');
  }
  
  getCreditCard(key) {
    return this.vaultdata.child(this.user.vaultid + '/creditcards/' + key);
  }

  AddCreditCard(item) {
    this.vaultdata.child(this.user.vaultid + "/creditcards/").push(item);
  }

  deleteCreditCard(item) {
    this.vaultdata.child(this.user.vaultid + '/creditcards/' + item.$key).remove();
  }

  updateCreditCard(item, key) {
    this.vaultdata.child(this.user.vaultid + '/creditcards/' + key).update({
      owner: item.owner, 
      name: item.name, 
      namelower: item.namelower, 
      number: item.number, 
      expirationdate: item.expirationdate, 
      routing: item.routing,
      type: item.type,
      cvv: item.cvv,
      notes: item.notes,
      recentid: item.recentid
    });
  }

  //
  // INSURANCES
  //-----------------------------------------------------------------------  
  getAllInsurances() {
    return this.vaultdata.child(this.user.vaultid + '/insurances').orderByChild('namelower');
  }
  
  getInsurance(key) {
    return this.vaultdata.child(this.user.vaultid + '/insurances/' + key);
  }

  addInsurance(item) {
    this.vaultdata.child(this.user.vaultid + "/insurances/").push(item);
  }

  deleteInsurance(item) {
    this.vaultdata.child(this.user.vaultid + '/insurances/' + item.$key).remove();
  }

  updateInsurance(item, key) {
    console.log(item, key);
    /*this.vaultdata.child(this.user.vaultid + '/insurances/' + key).update({
      name: item.name, 
      namelower: item.namelower, 
      site: item.site, 
      number: item.number, 
      username: item.username, 
      password: item.password, 
      description: item.description,
      notes: item.notes
    });*/
  }

}