import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
