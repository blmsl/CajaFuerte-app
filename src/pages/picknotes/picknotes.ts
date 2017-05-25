import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-picknotes',
  templateUrl: 'picknotes.html'
})

export class PickNotesPage {
  
  transaction;
  msg;
   
  constructor(public nav: NavController, public auth: AuthService) {

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