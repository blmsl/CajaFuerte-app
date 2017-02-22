import {Component} from '@angular/core';

import { AlertController, NavController, ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

/*import { Settings } from '../../providers/settings';*/

@Component({
  templateUrl: 'touchid.html'
})

export class TouchIDPage { 
  
  confirmpwd: string = '';
  touchidenabled: boolean = false;
  lockicon: string;
        
  constructor(
    public alertCtrl: AlertController, 
    public nav: NavController, 
    public viewCtrl: ViewController, 
    public storage: Storage) {

    this.lockicon = 'lock';
    
     storage.ready().then(() => {
      
      // Get touchid settings
      this.storage.get('option1').then( touchid => {
        this.touchidenabled = touchid;
      })

      // Get pwd settings
      this.storage.get('option2').then( pwd => {
        this.confirmpwd = pwd;
      })

    });

  }
 
  save() {
    if (this.touchidenabled) {
      // make sure pwd has been entered
      if (this.confirmpwd != '') {
        this.storage.set('option1', this.touchidenabled);
        this.storage.set('option2', this.confirmpwd);
        this.goBack();
      } else {
        this.showAlert();
      }
    } else {
      // remove password and clear storage
      this.confirmpwd = '';
      this.storage.set('option1', false);
        this.storage.set('option2', '');
      this.goBack();
    }
  }

  toggleTouchID(e) {
    this.touchidenabled = e.checked;
    if (!e.checked) {
      this.confirmpwd = '';
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