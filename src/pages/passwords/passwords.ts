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

  groupedAccounts = [];
  accounts: FirebaseListObservable<any[]>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public auth: AuthService) {
      //this.accounts = this.auth.getAccounts();
  }

  ionViewDidLoad() {

    this.auth.getAllAccounts().on('value', (accounts) => { 

      var that = this;
      this.groupedAccounts = [];
      let currentAccounts = [];
      let currentLetter = false;

      accounts.forEach( spanshot => {

        let account = spanshot.val();
        let tempAccount = ({
          $key: spanshot.key,
          description: account.description,
          name: account.name,
          namelower: account.namelower,
          notes: account.notes,
          number: account.number,
          password: account.password,
          site: account.site,
          username: account.username
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
