import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { PasswordsPage } from '../passwords/passwords';
import { DriverLicensesPage } from '../driverlicenses/driverlicenses';
import { BankAccountsPage } from '../bankaccounts/bankaccounts';
import { CreditCardsPage } from '../creditcards/creditcards';

import { AuthService } from '../../providers/auth-service';

import { TranslateService } from 'ng2-translate/ng2-translate';

declare var TimelineMax: any;
declare var Back: any;

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})

export class ListMasterPage {

  tl: any;

  pages: Array<{id: string, title: string, component: any, icon: string, color: string}>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public auth: AuthService) {

    this.tl = new TimelineMax({delay: 1});
    
    translate.get([
      "ACCOUNTS_PASSWORDS_TITLE",
      "DRIVERLICENSE_TITLE",
      "CARDS_TITLE",
      "BANK_ACCOUNTS_TITLE",
      "INSURANCE_TITLE",
      "DOCUMENTS_TITLE"
      ])
    .subscribe((values) => {
      
      this.pages = [
        {
          id: 'card1',
          title: values.ACCOUNTS_PASSWORDS_TITLE, 
          component: PasswordsPage, 
          icon: 'cajafuerte_form_icon_passwords.svg', 
          color: ''
        },
        {
          id: 'card2',
          title: values.DRIVERLICENSE_TITLE, 
          component: DriverLicensesPage,
          icon: 'cajafuerte_form_icon_ids.svg', 
          color: ''
        },
        {
          id: 'card3', 
          title: values.CARDS_TITLE, 
          component: CreditCardsPage,
          icon: 'cajafuerte_form_icon_cards.svg', 
          color: ''
        },
        { 
          id: 'card4',
          title: values.BANK_ACCOUNTS_TITLE, 
          component: BankAccountsPage,
          icon: 'cajafuerte_form_icon_bank_accounts.svg', 
          color: ''
        },
        { 
          id: 'card5',
          title: values.INSURANCE_TITLE, 
          component: DriverLicensesPage,
          icon: 'cajafuerte_form_icon_insurance.svg', 
          color: ''
        },
        { 
          id: 'card6',
          title: values.DOCUMENTS_TITLE, 
          component: DriverLicensesPage,
          icon: 'cajafuerte_form_icon_documents.svg', 
          color: ''
        }
      ];
    });
    this.auth.LoadingControllerDismiss();
  }

  ionViewDidLoad() {
    this.refreshPage();
  }

  addItem() {
    
  }

  deleteItem(item) {
    
  }

  openPage(item) {
    this.auth.LoadingControllerShow();
    this.navCtrl.push(item.component, { item: item });
  }

  refreshPage() {

    let card1 = document.getElementById('card1');
    let card2 = document.getElementById('card2');
    let card3 = document.getElementById('card3');
    let card4 = document.getElementById('card4');
    let card5 = document.getElementById('card5');
    let card6 = document.getElementById('card6');

    this.tl
      .from(card1, .1, { y: 1000})
      .from(card2, .1, { y: 1000})
      .from(card3, .1, { y: 1000})
      .from(card4, .1, { y: 1000})
      .from(card5, .1, { y: 1000})
      .from(card6, .1, { y: 1000})
      /*.from(card1, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.15")
      .from(card2, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.14")
      .from(card3, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.13")
      .from(card4, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.12")
      .from(card5, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.11")
      .from(card6, .1, {autoAlpha: 0, ease: Back.easeOut.config(4), scale: 0.5}, "-=.10");*/
  }
  
}
