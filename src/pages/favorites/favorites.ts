import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { PasswordPage } from '../password/password';
import { DriverLicensePage } from '../driverlicense/driverlicense';
import { BankAccountPage } from '../bankaccount/bankaccount';
import { CreditCardPage } from '../creditcard/creditcard';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  
  pages: any;
  favArray: {};
  noitemsfound: boolean = true;

  constructor(public navCtrl: NavController, public auth: AuthService) {

    this.auth.LoadingControllerShow();
    this.pages = auth.getDefaultForms();

  }

  ionViewDidEnter() {

    this.noitemsfound = true;
    
    this.auth.getFavorites().on('value', (favsList) => {

      let rawList= [];

      // Loop through each item
      favsList.forEach( spanshot => {
        
        // We found recent items, hide noitemsfound section
        this.noitemsfound = false;

        var fav = spanshot.val();

        // Get icon and color
        switch(fav.component) {
          case 'PasswordPage':
            fav.color = this.pages[0].color;
            fav.icon = this.pages[0].icon;
            break;
          case 'DriverLicensePage': 
            fav.color = this.pages[1].color;
            fav.icon = this.pages[1].icon;
            break;
          case 'BankAccountPage': 
            fav.color = this.pages[2].color;
            fav.icon = this.pages[2].icon;
            break;
          case 'CreditCardPage': 
            fav.color = this.pages[3].color;
            fav.icon = this.pages[3].icon;
            break;
          case 'InsurancePage': 
            fav.color = this.pages[4].color;
            fav.icon = this.pages[4].icon;
            break;
        }

        rawList.push({
          sourcekey: fav.sourcekey,
          color: fav.color,
          component: fav.component,
          dateCreated: fav.dateCreated,
          icon: fav.icon,
          name: fav.name
        });
      });
      this.favArray = rawList.reverse();
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
      case 'InsurancePage': 
        this.navCtrl.push(CreditCardPage, { key: recent.sourcekey });
        break;
		}
  }

}
