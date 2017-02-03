import { Injectable } from '@angular/core';

import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  
  private authState: FirebaseAuthState;
  private user;
  private userauth;
  private userdata;

  constructor(public auth$: AngularFireAuth) {
    
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
    //this.userdata = firebase.database().ref('/users/');
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

  signInWithEmail(): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({
      provider: AuthProviders.Password,
      method: AuthMethods.Password
    });
  }

  signUpWithEmail(credentials): firebase.Promise<FirebaseAuthState> {
    return this.auth$.createUser(credentials).then((authData) => {
      this.userauth = authData;
      this.user = credentials;
      this.createInitialSetup();
    }).catch((error) => {
      console.log(error);
    });
  }

  signOut(): void {
    this.auth$.logout();
  }

  displayName(): string {
    if (this.authState != null) {
      return this.authState.facebook.displayName;
    } else {
      return '';
    }
  }

  createInitialSetup() {

    this.createUserProfile();

  }

  createUserProfile() {

    // Set basic user profile defaults
    var profile = {
      datecreated: firebase.database['ServerValue']['TIMESTAMP'],
      defaultbalance: 'Current',
      defaultdate: 'None',
      email: this.user.email,
      enabletouchid: 'false',
      fullname: this.user.fullname,
      nickname: this.user.fullname,
      profilepic: 'http://www.gravatar.com/avatar?d=mm&s=140',
      accounttypescount: '6',
      paymentplan: 'Free'
    };
    this.user.defaultbalance = profile.defaultbalance;
    this.user.defaultdate = profile.defaultdate;
    this.user.enabletouchid = profile.enabletouchid;
    this.user.profilepic = profile.profilepic;

    
    // Save user profile
    this.userdata.child(this.userauth.uid).update(profile);

  }

}