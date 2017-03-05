import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
