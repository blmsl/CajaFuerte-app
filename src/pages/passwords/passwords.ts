import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { PasswordPage } from '../password/password';

@Component({
  selector: 'page-passwords',
  templateUrl: 'passwords.html'
})

export class PasswordsPage {

  groupedAccounts = [];

  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public auth: AuthService) {}

  ionViewDidLoad() {

    this.auth.getAllAccounts().on('value', (accounts) => { 

      var that = this;
      this.groupedAccounts = [];
      let currentAccounts = [];
      let currentLetter = '';

      accounts.forEach( spanshot => {

        let account = spanshot.val();
        account.favoriteid = account.favoriteid === undefined ?  '' : account.favoriteid;
        let tempAccount = ({
          $key: spanshot.key,
          description: account.description,
          name: account.name,
          favoriteid: account.favoriteid,
          icon: this.auth.pages[0].icon,
          color: this.auth.pages[0].color,
        });

        let thisLetter = tempAccount.name.charAt(0);
        thisLetter = thisLetter.toUpperCase();
        if(thisLetter != currentLetter){
          currentLetter = tempAccount.name.charAt(0).toUpperCase();
          currentLetter = currentLetter.toUpperCase();
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
    this.navCtrl.push(PasswordPage, { key: '0' });
  }

  openItem(account) {
    this.auth.referrer = 'PasswordsPage';
    this.navCtrl.push(PasswordPage, { key: account.$key });
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
            this.auth.deleteAccount(account);
          }
        }
      ]
    });
    alert.present();
  }

}
