import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'password.html'
})

export class PasswordPage {

  validationMessage: string;
  showValidationMessage: boolean = false;
  title: string;

  constructor(
      public nav: NavController,
      public modalController: ModalController,
      public navParams: NavParams) { }
  

  ionViewWillEnter() {
    
  }

  save() {

    /*// Format date
    let dt = moment(this.displaydate, moment.ISO_8601).valueOf();
    this.account.dateopen = dt
    
    if (this.account.mode === 'New') {
      this.userData.addAccount(this.account);
    } else {
      this.userData.updateAccount(this.account);
    }
    this.nav.pop();*/
  }

  pickAccountName() {
    /*this.showValidationMessage = false;
    this.nav.push(PickAccountNamePage);*/
  }

  pickAccountType() {
    /*if (!this.hasDataAccountName) {
      // Make sure the account name has been entered
      this.showValidationMessage = true;
      this.validationMessage = "Please enter account name";
      return;
    }
    this.nav.push(PickAccountTypePage);*/
  }
  
}