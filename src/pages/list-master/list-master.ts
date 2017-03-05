import { Component } from '@angular/core';

import { NavController, ModalController } from 'ionic-angular';

import { PasswordsPage } from '../passwords/passwords';

import { AuthService } from '../../providers/auth-service';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})

export class ListMasterPage {

  pages: Array<{title: string, subtitle: string, component: any, icon: string, color: string}>;

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public auth: AuthService) {
    
    translate.get(["ACCOUNTS_PASSWORDS_TITLE",
                  "ACCOUNTS_PASSWORDS_SUBTITLE"])
    .subscribe((values) => {
      
      this.pages = [
        { 
          title: values.ACCOUNTS_PASSWORDS_TITLE, 
          subtitle: values.ACCOUNTS_PASSWORDS_SUBTITLE, 
          component: PasswordsPage, 
          icon: 'lock.png', 
          color: 'faLightBlue'
        }
      ];
    });
    this.auth.LoadingControllerDismiss();
  }

  addItem() {
    
  }

  deleteItem(item) {
    
  }

  openPage(item) {
    this.auth.LoadingControllerShow();
    this.navCtrl.push(item.component, { item: item });
  }
  
}
