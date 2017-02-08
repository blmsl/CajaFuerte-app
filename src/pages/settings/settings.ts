import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from 'ng2-translate/ng2-translate';


@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  language = 'en';
  mode: string;
  profile: {fullname: string, email: string, vaultnumber: string, paymentplan: string, touchid: boolean} = {
    fullname: '', 
    email: '', 
    vaultnumber: '', 
    paymentplan: 'Free',
    touchid: false
  };

  constructor(public navCtrl: NavController,
              public translate: TranslateService) {
  }

  toggleTouchID(e) {
    console.log(e);
  }

  toggleSelect(e) {
    this.translate.use(e);
  }
  
}
