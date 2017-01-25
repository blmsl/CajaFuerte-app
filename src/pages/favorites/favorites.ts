import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { Item } from '../../models/item';

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})
export class FavoritesPage {
  
  currentItems: Item[];

  constructor(
    public navCtrl: NavController, 
    public modalCtrl: ModalController) {}

  ionViewDidLoad() {
  }

  addItem() {
    
  }

  deleteItem(item) {
    
  }
}
