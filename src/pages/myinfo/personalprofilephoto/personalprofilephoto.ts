import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AuthService } from '../../../providers/auth-service';

@Component({
  templateUrl: 'personalprofilephoto.html'
})

export class PersonalProfilePhotoPage {

  /*public userPhoto: any;
  public userPhotoDisplay: any;*/

  photos: any;
  public base64Image: string;

  constructor(
    private camera: Camera,
    public nav: NavController,
    public auth: AuthService) { }

  ngOnInit() {
    this.photos = [];
  }

  dismiss() {
    this.nav.pop();
  }

  savePicture() {
    //this.auth.savePicture(this.userPhoto);
    //this.dismiss();
  }

  takePhoto() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this
      .camera
      .getPicture(options)
      .then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this
          .photos
          .push(this.base64Image);
        this
          .photos
          .reverse();
      }, (err) => {
        console.log(err);
      });
  }

  /*takePicture() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.PNG,
      targetWidth: 900,
      targetHeight: 900,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.userPhoto = imageData;
      this.userPhotoDisplay = "data:image/jpeg;base64," + imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }*/

}