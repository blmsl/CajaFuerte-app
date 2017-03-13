import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';

@Component({
  templateUrl: 'changeemail.html'
})

export class ChangeEmailPage { 

  newemail: string = '';

  constructor(public viewCtrl: ViewController) {}
  
  changeEmail(newemail) {
    this.viewCtrl.dismiss(newemail);
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
    
}