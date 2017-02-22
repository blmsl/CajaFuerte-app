import { Component } from '@angular/core';

import { NavController, ModalController, AlertController } from 'ionic-angular';

import { FirebaseListObservable } from 'angularfire2';

import { AuthService } from '../../providers/auth-service';

import { PasswordPage } from '../password/password';

@Component({
  selector: 'page-passwords',
  templateUrl: 'passwords.html'
})

export class PasswordsPage {

  accounts: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public auth: AuthService) {
      this.accounts = this.auth.getAccounts();
  }

  addItem() {
    this.navCtrl.push(PasswordPage);
  }

  openItem(account) {
    this.auth.referrer = 'PasswordsPage';
    this.navCtrl.push(PasswordPage, { account: account });
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
