import { Component } from '@angular/core';

import { AlertController, NavController, ModalController, NavParams } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-driverlicense',
  templateUrl: 'driverlicense.html'
})

export class DriverLicensePage {

  title: string;
  showSkip = false;
  mode: string;
  key: string;
  account: {name: string, namelower: string, number: string, issuedate: string, expirationdate: string, state: string, notes: string, photo: string, recentid: string} = {
    name: '', 
    namelower: '', 
    number: '', 
    issuedate: '', 
    expirationdate: '', 
    state: '', 
    notes: '', 
    photo: '',
    recentid: ''
  };
  photos = [];
  base64Image : string;

  constructor(
    public nav: NavController, 
    public modalController: ModalController, 
    public navParams: NavParams, 
    public camera : Camera, 
    public alertCtrl : AlertController,
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    // Populate photos from database
    this.base64Image = "data:image/jpeg;base64," + this.auth.user.profilepic;
    this.photos.push(this.auth.user.profilepic);

    translate.get(["EDIT_TITLE","CREATE_DRIVER_LICENSE_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_DRIVER_LICENSE_TITLE;
        this.mode = "New";
      } else {
        this.auth.getDriverLicense(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();
          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'DriverLicensePage');
        });
      }
    });
  }

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'DriverLicensesPage': {
        this.auth.pwdNotes = '';
        break;
      }
      case 'PickNotesPage': {
        this.account.notes = this.auth.pwdNotes;
        break;
      }
    }
  }

  deletePhoto(index) {
    let confirm = this.alertCtrl.create({
      title: 'Please Confirm',
      message: 'Are you sure you want to delete this photo? There is NO undo!',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        }, {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            console.log('Agree clicked');
            this
              .photos
              .splice(index, 1);
            //return true;
          }
        }]
      });
    confirm.present();
  }

  takePhoto() {
    const options : CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.photos.push(this.base64Image);
      this.photos.reverse();
    }, (err) => {
      console.log(err);
    });
  }

  save() {
    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.AddDriverLicense(this.account);
    } else {
      this.auth.updateDriverLicense(this.account, this.key);
    }
    this.nav.pop();
  }

  pickNotes() {
    this.auth.pwdNotes = this.account.notes;
    this.nav.push(PickNotesPage);
  }
  
}