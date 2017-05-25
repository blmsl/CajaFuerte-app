import { Component } from '@angular/core';

import { NavController, ModalController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';
import { TakePhotoPage } from '../../pages/takephoto/takephoto';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  templateUrl: 'creditcard.html'
})

export class CreditCardPage {

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

    translate.get(["EDIT_TITLE","CREATE_CREDIT_CARD_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_CREDIT_CARD_TITLE;
        this.mode = "New";
      } else {
        this.auth.getCreditCard(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();
          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'CreditCardPage');
        });
      }
    });
  }

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'CreditCardsPage': {
        this.auth.pwdNotes = '';
        break;
      }
      case 'PickNotesPage': {
        this.account.notes = this.auth.pwdNotes;
        this.auth.pwdNotes = '';
        break;
      }
    }
  }

  save() {
    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.AddCreditCard(this.account);
    } else {
      this.auth.updateCreditCard(this.account, this.key);
    }
    this.nav.pop();
  }

  pickNotes() {
    this.auth.pwdNotes = this.account.notes;
    this.nav.push(PickNotesPage);
  }

  takePhotopage() {
    this.nav.push(TakePhotoPage, { source: 'CreditCardPage' });
  }
  
}