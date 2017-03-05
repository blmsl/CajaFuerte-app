import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';

export interface Slide {
  title: string;
  description: string;
  image: string;
  icon: string;
  color: string;
  class: string;
}

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {
  slides: Slide[];
  showSkip = true;

  constructor(public navCtrl: NavController) {}

  startApp() {
    this.navCtrl.setRoot(WelcomePage, {}, {
      animate: true,
      direction: 'forward'
    });
  }

}
