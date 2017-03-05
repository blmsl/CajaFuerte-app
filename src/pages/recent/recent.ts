import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-recent',
  templateUrl: 'recent.html'
})
export class RecentPage {
  currentItems: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

}
