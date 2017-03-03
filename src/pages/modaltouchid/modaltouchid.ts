import { Component } from '@angular/core';

import { NavController, ViewController } from 'ionic-angular';

import { TranslateService } from 'ng2-translate/ng2-translate';

export interface Slide {
  title: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  class: string;
}

@Component({
  selector: 'page-modaltouchid',
  templateUrl: 'modaltouchid.html'
})
export class ModalTouchIDPage {
  slides: Slide[];
  showSkip = true;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    translate: TranslateService) {}

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }

}
