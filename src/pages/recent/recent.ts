import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

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
  
  pages: any;
  recentArray: {};
  noitemsfound: boolean = true;

  constructor(
    public navCtrl: NavController, 
    public alertCtrl : AlertController,
    public auth: AuthService) {
    
    this.auth.LoadingControllerShow();
    this.pages = auth.getDefaultForms();

  }

  ionViewDidLoad() {

    this.auth.getRecent().on('value', (recentList) => {
      
      let rawList= [];

      // Loop through each item
      recentList.forEach( spanshot => {

        // We found recent items, hide noitemsfound section
        this.noitemsfound = false;

        let recent = spanshot.val();

        // Get icon and color
        switch(recent.component) {
          case 'PasswordPage': 
            recent.color = this.pages[0].color;
            recent.icon = this.pages[0].icon;
            break;
          case 'DriverLicensePage': 
            recent.color = this.pages[1].color;
            recent.icon = this.pages[1].icon;
            break;
          case 'BankAccountPage': 
            recent.color = this.pages[2].color;
            recent.icon = this.pages[2].icon;
            break;
          case 'CreditCardPage': 
            recent.color = this.pages[3].color;
            recent.icon = this.pages[3].icon;
            break;
          case 'InsurancePage': 
            recent.color = this.pages[4].color;
            recent.icon = this.pages[4].icon;
            break;
        }
        
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
      case 'InsurancePage': 
        this.navCtrl.push(CreditCardPage, { key: recent.sourcekey });
        break;
		}
  }

  deleteRecent() {
    let confirm = this.alertCtrl.create({
      title: 'Please Confirm',
      message: 'Are you sure you want to delete all recent activity? There is NO undo!',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            /*console.log('cancel clicked');*/
          }
        }, {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            this.auth.deleteRecent();
            this.noitemsfound = true;
          }
        }]
      });
    confirm.present();    
  }

}
