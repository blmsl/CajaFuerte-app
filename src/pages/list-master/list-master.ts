import { Component } from '@angular/core';

import { MenuController, NavController, ModalController } from 'ionic-angular';

import { PasswordsPage } from '../passwords/passwords';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})

export class ListMasterPage {

  pages: Array<{title: string, component: any, icon: string, color: string, showloader: boolean}>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public menu: MenuController,
    public auth: AuthService) {}

  ionViewDidLoad() {
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Accounts / Passwords', component: PasswordsPage, icon: 'lock.png', color: 'faLightBlue', showloader: true }
      /*{ title: 'Drivers License', component: PasswordsPage, icon: 'fa-id-card-o', color: '', showloader: false  },
      { title: 'Alarm Codes', component: PasswordsPage, icon: 'fa-bell-o', color: '', showloader: true  },
      { title: 'Vehicle Registrations', component: PasswordsPage, icon: 'fa-car', color: '', showloader: false  },*/
    ];

    this.auth.LoadingControllerDismiss();

  }

  addItem() {
    
  }

  deleteItem(item) {
    
  }

  openPage(item) {
    this.navCtrl.push(item.component, { item: item });
  }

  ionViewDidEnter() {
    this.menu.enable(true);
    this.menu.swipeEnable(true);
  }
  
}
