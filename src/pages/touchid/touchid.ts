import {Component} from '@angular/core';

import { AlertController, NavController, ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { AuthService } from '../../providers/auth-service';

@Component({
  templateUrl: 'touchid.html'
})

export class TouchIDPage { 
  
  email: string = '';
  pwd: string = '';
  touchidenabled: boolean = false;
  lockicon: string;
        
  constructor(
    public alertCtrl: AlertController, 
    public nav: NavController, 
    public viewCtrl: ViewController, 
    public storage: Storage,
    public auth: AuthService) {

    this.lockicon = 'lock';

    // Get touchid settings
    this.storage.get('option1').then( touchid => {
      this.touchidenabled = touchid;
    })

    // Get pwd settings
    this.storage.get('option2').then( pwd => {
      this.pwd = pwd;
    })

    // Get pwd settings
    this.storage.get('option3').then( email => {
      this.email = email;
    })

  }
 
  save() {
    if (this.touchidenabled) {
      
      // make sure credentials have been entered
      if (this.email === '') {
        this.showAlert();
        return;
      }
      if (this.pwd === '') {
        this.showAlert();
        return;
      }

      // Save info to storage
      this.storage.set('option1', this.touchidenabled);
      this.storage.set('option2', this.pwd);
      this.storage.set('option3', this.email);
      this.goBack();
      
    } else {

      // TouchID not enabled, then clear storage
      this.storage.set('option1', false);
      this.storage.set('option2', '');
      this.storage.set('option3', '');
      this.auth.storageClean();
      this.goBack();

    }
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.lockicon = input.type === 'password' ?  'lock' : 'unlock-alt';
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Missing Email and/or Password',
      message: 'Please enter your credentials',
      buttons: [
        /*{
          text: 'Cancel',
          handler: () => {
            //console.log('Cancel RemoveUser clicked');
          }
        },*/
        {
          text: 'Ok',
          cssClass: 'alertDanger',
          handler: () => {
            try {
              
            } catch(error){
              console.log(error);
            }            
            //this.nav.setRoot(FirstRunPage, {}, {animate: true, direction: 'forward'});
          }
        }
      ]
    });
    alert.present();
  }

  goBack() {
    this.nav.pop();
  }
    
}