import { Component } from '@angular/core';

import { AlertController, NavController, ModalController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';
import { TakePhotoPage } from '../../pages/takephoto/takephoto';

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
  account: {name: string, namelower: string, number: string, issuedate: string, expirationdate: string, state: string, notes: string, recentid: string} = {
    name: '', 
    namelower: '', 
    number: '', 
    issuedate: '', 
    expirationdate: '', 
    state: '', 
    notes: '', 
    recentid: ''
  };
  photos = [];

  constructor(
    public nav: NavController, 
    public modalController: ModalController, 
    public navParams: NavParams,
    public alertCtrl : AlertController,
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    translate.get(["EDIT_TITLE","CREATE_DRIVER_LICENSE_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_DRIVER_LICENSE_TITLE;
        this.mode = "New";
      } else {
        
        // Get license details
        this.auth.getDriverLicense(this.key).on('value', snapshot => {
          this.account = snapshot.val();

          var photosRef = this.auth.getDriverLicensePhotosRef(this.key);
          this.photos = [];
          photosRef.on('value', element => {
            element.forEach(snap => {
              var photo = snap.val();
              let tempPhoto = ({
                $key: snap.key,
                photourl: photo.photourl
              });
              this.photos.push(tempPhoto);
            });            
          });

          this.account.recentid = this.account.recentid === undefined ?  '' : this.account.recentid;
          this.title = values.EDIT_TITLE + ' ' + this.account.name;
          this.mode = "Edit";
          // Add account to recent
          this.auth.handleRecent(snapshot.key, this.account, 'DriverLicensePage');
        });

        // Get license photos
        //this.refreshPhotos();

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
        this.auth.pwdNotes = '';
        break;
      }
    }
  }

  deletePhoto(photo) {
    let confirm = this.alertCtrl.create({
      title: 'Please Confirm',
      message: 'Are you sure you want to delete this photo? There is NO undo!',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            /*console.log('cancel clicked');*/
          }
        }, {
          text: 'Delete',
          cssClass: 'alertDanger',
          handler: () => {
            this.auth.deleteDriverLicensePhoto(this.key, photo);
          }
        }]
      });
    confirm.present();
  }

  takePhotopage() {
    this.nav.push(TakePhotoPage, { source: 'DriverLicensePage', key: this.key });
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