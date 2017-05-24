import { Component } from '@angular/core';

import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { BankAccountPage } from '../bankaccount/bankaccount';

@Component({
  selector: 'page-bankaccounts',
  templateUrl: 'bankaccounts.html'
})

export class BankAccountsPage {

  groupedAccounts = [];

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public navParams: NavParams, 
    public auth: AuthService) {}

  ionViewDidLoad() {

    this.auth.getAllBankAccounts().on('value', (accounts) => { 

      var that = this;
      this.groupedAccounts = [];
      let currentAccounts = [];
      let currentLetter = '';

      accounts.forEach( snapshot => {

        let account = snapshot.val();
        let tempAccount = ({
          $key: snapshot.key,
          name: account.name,
          icon: this.auth.pages[3].icon,
          color: this.auth.pages[3].color,
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
    this.navCtrl.push(BankAccountPage, { key: '0' });
  }

  openItem(account) {
    this.auth.referrer = 'BankAccountsPage';
    this.navCtrl.push(BankAccountPage, { key: account.$key });
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
            this.auth.deleteBankAccount(account);
          }
        }
      ]
    });
    alert.present();
  }

}