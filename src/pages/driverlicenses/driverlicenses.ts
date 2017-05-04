import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { DriverLicensePage } from '../driverlicense/driverlicense';

@Component({
  selector: 'page-driverlicenses',
  templateUrl: 'driverlicenses.html'
})

export class DriverLicensesPage {

  groupedAccounts = [];

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams, 
    public auth: AuthService) {}

  ionViewDidLoad() {

    this.auth.getAllDriverLicenses().on('value', (accounts) => { 

      var that = this;
      this.groupedAccounts = [];
      let currentAccounts = [];
      let currentLetter = '';

      accounts.forEach( spanshot => {

        let account = spanshot.val();
        let tempAccount = ({
          $key: spanshot.key,
          name: account.name,
          icon: this.auth.pages[1].icon,
          color: this.auth.pages[1].color,
        });

        if(tempAccount.name.charAt(0) != currentLetter){
          currentLetter = tempAccount.name.charAt(0).toUpperCase();
          let newGroup = {
            letter: currentLetter,
            accounts: []
          };
          currentAccounts = newGroup.accounts;
          that.groupedAccounts.push(newGroup);
        }
        currentAccounts.push(tempAccount);
      })
      // Disable loading controller when the promise is complete
      this.auth.LoadingControllerDismiss();
    });  
  }

  addItem() {
    this.navCtrl.push(DriverLicensePage, { key: '0' });
  }

  openItem(account) {
    this.auth.referrer = 'DriverLicensesPage';
    this.navCtrl.push(DriverLicensePage, { key: account.$key });
  }

  deleteItem(slidingItem, account) {
    let alert = this.alertCtrl.create({
      title: 'Delete Account',
      message: 'Are you sure you want to delete ' + account.name + '?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel RemoveUser clicked');
            slidingItem.close();
          }
        },
        {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            slidingItem.close();
            this.auth.deleteDriverLicense(account);
          }
        }
      ]
    });
    alert.present();
  }
}