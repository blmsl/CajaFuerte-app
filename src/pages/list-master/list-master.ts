import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { PasswordsPage } from '../passwords/passwords';

import { Item } from '../../models/item';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})

export class ListMasterPage {

  currentItems: Item[];
  pages: Array<{title: string, component: any, icon: string, color: string, showloader: boolean}>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController) {}

  ionViewDidLoad() {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Passwords', component: PasswordsPage, icon: 'fa-unlock', color: '', showloader: true }
      /*{ title: 'Drivers License', component: PasswordsPage, icon: 'fa-id-card-o', color: '', showloader: false  },
      { title: 'Alarm Codes', component: PasswordsPage, icon: 'fa-bell-o', color: '', showloader: true  },
      { title: 'Vehicle Registrations', component: PasswordsPage, icon: 'fa-car', color: '', showloader: false  },*/
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
