import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { PasswordPage } from '../password/password';
import { DriverLicensePage } from '../driverlicense/driverlicense';
import { BankAccountPage } from '../bankaccount/bankaccount';
import { CreditCardPage } from '../creditcard/creditcard';

@Component({
  selector: 'page-recent',
  templateUrl: 'recent.html'
})
export class RecentPage {
  
  recentArray: {};
  noitemsfound: boolean = true;

  constructor(public navCtrl: NavController, public auth: AuthService) {
    
    this.auth.LoadingControllerShow();

  }

  ionViewDidLoad() {

    this.auth.getRecent().on('value', (recentList) => {
      let rawList= [];
      recentList.forEach( spanshot => {
        
        // We found recent items, hide noitemsfound section
        this.noitemsfound = false;

        // Loop through each item and 
        var recent = spanshot.val();
        rawList.push({
          sourcekey: recent.sourcekey,
          color: recent.color,
          component: recent.component,
          dateCreated: recent.dateCreated,
          icon: recent.icon,
          name: recent.name
        });
      });
      this.recentArray = rawList.reverse();
      this.auth.LoadingControllerDismiss();
    });
  }

  openItem(recent) {
    switch(recent.component) {
			case 'PasswordPage': 
        this.navCtrl.push(PasswordPage, { key: recent.sourcekey });
        break;
      case 'DriverLicensePage': 
        this.navCtrl.push(DriverLicensePage, { key: recent.sourcekey });
        break;
      case 'BankAccountPage': 
        this.navCtrl.push(BankAccountPage, { key: recent.sourcekey });
        break;
      case 'CreditCardPage': 
        this.navCtrl.push(CreditCardPage, { key: recent.sourcekey });
        break;
		}
  }

}
