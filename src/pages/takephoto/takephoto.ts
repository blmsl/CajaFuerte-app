import { Component } from '@angular/core';

import { ActionSheetController, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service';

import * as firebase from 'firebase';

import * as moment from 'moment';

@Component({
  selector: 'page-takephoto',
  templateUrl: 'takephoto.html'
})

export class TakePhotoPage {

  public saveThisPic: string = '';
  public displayThisPic: string = '';
  public source: string;
  public key: string;
  private loadProgress: number = 0;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public camera: Camera,
    public auth: AuthService) {
      this.source = navParams.get('source');
      this.key = navParams.get('key');
    }
  
  ionViewDidLoad() {
    this.photoSource();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  photoSource() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Choose an image source',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.takePhoto();
          }
        },{
          text: 'Photo Albumns',
          handler: () => {
            this.selectFromGallery();
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePhoto() {

    let cameraOptions : CameraOptions = {
        sourceType: this.camera.PictureSourceType.CAMERA,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        targetWidth: 800,
        targetHeight: 800,
        encodingType: this.camera.EncodingType.PNG,
        correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.saveThisPic = imageData;
      this.displayThisPic = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  selectFromGallery() {
    let cameraOptions : CameraOptions = {
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        quality: 100,
        targetWidth: 800,
        targetHeight: 800,
        encodingType: this.camera.EncodingType.PNG,
        correctOrientation: true
    };
    this.camera.getPicture(cameraOptions).then((imageData) => {
      this.saveThisPic = imageData;
      this.displayThisPic = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      // Handle error
    });
  }

  save() {
    this.auth.savePhoto(this.saveThisPic, this.source, this.key);
    this.showProgressBar();
  }

  showProgressBar() {
    setInterval(() => {
			if(this.loadProgress < 100){
				this.loadProgress++;
			} else {
        // go back
        this.viewCtrl.dismiss();
      }
		}, 50);
  }
  
}