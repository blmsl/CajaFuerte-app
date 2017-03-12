import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

import { PasswordPage } from '../password/password';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  
  favstArray: {};
  noitemsfound: boolean = true;

  constructor(public navCtrl: NavController, public auth: AuthService) {

    this.auth.LoadingControllerShow();

  }

  ionViewDidLoad() {

    this.auth.getFavorites().on('value', (favsList) => {
      let rawList= [];
      favsList.forEach( spanshot => {
        
        // We found recent items, hide noitemsfound section
        this.noitemsfound = false;

        // Loop through each item and 
        var fav = spanshot.val();
        rawList.push({
          $key: fav.key,
          color: fav.color,
          component: fav.component,
          dateCreated: fav.dateCreated,
          icon: fav.icon,
          name: fav.name
        });
      });
      this.favstArray = rawList.reverse();

      this.auth.LoadingControllerDismiss();
      
    });

  }

  openItem(recent) {
    switch(recent.component) {
			case 'PasswordPage': 
        this.navCtrl.push(PasswordPage, { key: recent.$key });
			default: PasswordPage;
		}
  }

}
