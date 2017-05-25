import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthService } from '../../providers/auth-service';

@Component({
  selector: 'page-takephoto',
  templateUrl: 'takephoto.html'
})

export class TakePhotoPage {

  public displayPhoto: string;
  public savePhoto: any;
  public source: string;

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    private camera: Camera,
    public auth: AuthService) {

      this.source = navParams.get('source');
      console.log(this.source);

    }
  
  ionViewDidLoad() {
    this.takePhoto();
  }

  dismiss() {
    this.nav.pop();
  }

  save() {
    this.auth.savePhoto(this.savePhoto, this.source);
    this.dismiss();
  }

  takePhoto() {
    const options : CameraOptions = {
      quality: 95,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      saveToPhotoAlbum: false,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.savePhoto = imageData;
      this.displayPhoto = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
  
}