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
    
     storage.ready().then(() => {
      
      // Get touchid settings
      this.storage.get('option1').then( touchid => {
        this.touchidenabled = touchid;
        //console.log(touchid);
      })

      // Get pwd settings
      this.storage.get('option2').then( pwd => {
        this.pwd = pwd;
        //console.log(pwd);
      })

      // Get pwd settings
      this.storage.get('option3').then( email => {
        this.email = email;
        //console.log(email);
      })

    });

  }
 
  save() {
    if (this.touchidenabled) {
      // make sure pwd has been entered
      if (this.pwd != '') {
        this.storage.set('option1', this.touchidenabled);
        this.storage.set('option2', this.pwd);
        this.storage.set('option3', this.email);
        this.goBack();
      } else {
        this.showAlert();
      }
    } else {
      // remove password and clear storage
      this.pwd = '';
      this.storage.set('option1', false);
      this.storage.set('option2', '');
      this.storage.set('option3', '');
      this.goBack();
    }
  }

  toggleTouchID(e) {
    this.touchidenabled = e.checked;
    if (!e.checked) {
      this.pwd = '';
      this.email = '';
    }
  }

  showPassword(input: any): any {
    input.type = input.type === 'password' ?  'text' : 'password';
    this.lockicon = input.type === 'password' ?  'lock' : 'unlock-alt';
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Missing Password',
      message: 'Please enter your password',
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