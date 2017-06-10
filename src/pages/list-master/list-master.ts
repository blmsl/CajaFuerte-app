import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { TranslateService } from 'ng2-translate/ng2-translate';

import { PasswordsPage } from '../passwords/passwords';
import { DriverLicensesPage } from '../driverlicenses/driverlicenses';
import { BankAccountsPage } from '../bankaccounts/bankaccounts';
import { CreditCardsPage } from '../creditcards/creditcards';
import { InsurancesPage } from '../insurances/insurances';

declare var TimelineMax: any;
declare var TweenMax: any;
declare var Back: any;
declare var CustomEase

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})

export class ListMasterPage {

  tl: any;
  pages: any;

  constructor(
    public navCtrl: NavController, 
    public translate: TranslateService,
    public auth: AuthService) {

    //
    // Load default forms
    //
    translate.get([
      "ACCOUNTS_PASSWORDS_TITLE",
      "DRIVERLICENSE_TITLE",
      "CARDS_TITLE",
      "BANK_ACCOUNTS_TITLE",
      "INSURANCE_TITLE"
      ])
    .subscribe((values) => {
      
      this.pages = auth.getDefaultForms();
      
      // PASSWORDS
      this.pages[0].title = values.ACCOUNTS_PASSWORDS_TITLE;
      this.pages[0].component = PasswordsPage;

      // DRIVERS LICENSE / IDs
      this.pages[1].title = values.DRIVERLICENSE_TITLE;
      this.pages[1].component = DriverLicensesPage;

      // CREDIT / DEBIT CARDS
      this.pages[2].title = values.CARDS_TITLE;
      this.pages[2].component = CreditCardsPage;

      // BANK ACCOUNTS
      this.pages[3].title = values.BANK_ACCOUNTS_TITLE;
      this.pages[3].component = BankAccountsPage;

      // INSURANCE
      /*this.pages[4].title = values.INSURANCE_TITLE;
      this.pages[4].component = InsurancesPage;*/

    });
    this.auth.LoadingControllerDismiss();
  }

  ionViewDidLoad() {
    this.refreshPage();
  }

  openPage(item) {
    this.auth.LoadingControllerShow();
    this.navCtrl.push(item.component);
  }

  refreshPage() {

    this.tl = new TimelineMax({delay: 0.1});

    CustomEase.create("myEase", "M0,0 C0.11,0.494 0.167,0.68 0.3,0.8 0.362,0.856 0.504,0.93 1,1");

    let card1 = document.getElementById('card1');
    let card2 = document.getElementById('card2');
    let card3 = document.getElementById('card3');
    let card4 = document.getElementById('card4');
    /*let card5 = document.getElementById('card5');*/

    this.tl
      .from(card1, 0.75, {x:1500, ease:"myEase"}, 0.5)
      .from(card2, 0.75, {x:1500, ease:"myEase"}, 0.7)
      .from(card3, 0.75, {x:1500, ease:"myEase"}, 0.9)
      .from(card4, 0.75, {x:1500, ease:"myEase"}, 1.1)
      /*.from(card5, 0.75, {x:1500, ease:"myEase"}, 1.3)*/
  }
  
}
