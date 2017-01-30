import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { PasswordPage } from '../password/password';

import { Item } from '../../models/item';

@Component({
  selector: 'page-passwords',
  templateUrl: 'passwords.html'
})

export class PasswordsPage {

  currentItems: Item[];
  accounts: Array<{title: string, component: any, icon: string, color: string, showloader: boolean}>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    // used for an example of ngFor and navigation
    this.accounts = [
      { title: 'Ionic', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: false },
      { title: 'Google Analytics', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: false },
      { title: 'Bank of America', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: true },
      { title: 'GitHub', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: true },
      { title: 'Twitter', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: false },
      { title: 'Facebook', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: false },
      { title: 'LinkedIn', component: PasswordPage, icon: 'finger-print', color: '#f4f4f4', showloader: false },
    ];
  }

  addItem() {
    
  }

  deleteItem(item) {
    
  }

  openPage(item) {
    this.navCtrl.push(item.component, { item: item });
  }
}
