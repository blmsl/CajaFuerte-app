import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailPage } from '../item-detail/item-detail';
import { Item } from '../../models/item';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  /**
   * Perform a service for the proper items.
   */
  getItems(ev) {
    
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.navCtrl.push(ItemDetailPage, {
      item: item
    });
  }

}
