import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'bankaccount.html'
})

export class BankAccountPage {

  title: string;
  showSkip = false;
  mode: string;
  key: string;
  account: {owner: string, name: string, namelower: string, nickname: string, type: string, number: string, routing: string, notes: string, recentid: string} = {
    owner: '', 
    name: '', 
    namelower: '', 
    nickname: '',
    type: '', 
    number: '', 
    routing: '', 
    notes: '', 
    recentid: ''
  };

  constructor(
    public nav: NavController, 
    public modalController: ModalController, 
    public navParams: NavParams, 
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    translate.get(["EDIT_TITLE","CREATE_BANK_ACCOUNT_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_BANK_ACCOUNT_TITLE;
        this.mode = "New";
      } else {
        this.auth.getBankAccount(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();
          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'BankAccountPage');
        });
      }
    });
  }

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'BankAccountsPage': {
        this.auth.pwdNotes = '';
        break;
      }
      case 'PickNotesPage': {
        this.account.notes = this.auth.pwdNotes;
        break;
      }
    }
  }

  save() {
    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.AddBankAccount(this.account);
    } else {
      this.auth.updateBankAccount(this.account, this.key);
    }
    this.nav.pop();
  }

  pickNotes() {
    this.auth.pwdNotes = this.account.notes;
    this.nav.push(PickNotesPage);
  }
  
}