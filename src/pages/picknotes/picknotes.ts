import { Component } from '@angular/core';

import { Platform, NavController } from 'ionic-angular';

import { Keyboard } from '@ionic-native/keyboard';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-picknotes',
  templateUrl: 'picknotes.html'
})

export class PickNotesPage {
  
  transaction;
  msg;
   
  constructor(
    public nav: NavController, 
    public platform: Platform, 
    public keyboard: Keyboard,
    public auth: AuthService) {
    
    this.platform.ready().then(() => {
      keyboard.disableScroll(true);
    });
    
  }

  ionViewDidLoad() {
    this.msg = this.auth.pwdNotes;
  }

  goBack() {
    this.nav.pop();
  }

  done() {
    this.auth.referrer = 'PickNotesPage';
    this.auth.pwdNotes = this.msg;
    this.goBack();
  }

}