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
  private userdata;
  private vaultdata;
  private profilepicdata;
  private vaultpicdata;

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public nav: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public camera: Camera,
    public auth: AuthService) {

      this.source = navParams.get('source');
      this.key = navParams.get('key');

      this.userdata = firebase.database().ref('/users/');
      this.vaultdata = firebase.database().ref('/vaults/');
      this.profilepicdata = firebase.storage().ref().child('/profilepics/');
      this.vaultpicdata = firebase.storage().ref().child('/vaultpics/');

    }
  
  ionViewDidLoad() {
    //this.photoSource();
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
    //this.auth.savePhoto(this.savePhoto, this.source, this.key);
    //this.viewCtrl.dismiss();
    
    //this.testProgressBar();

    this.savePhoto(this.savePhoto, this.source, this.key);

  }

  testProgressBar() {
    
    setInterval(() => {
			if(this.loadProgress < 100){
				this.loadProgress++;
			}
		}, 50);
  }

  savePhoto(pic, source, key) {
    let photoname = moment().valueOf() + '.png';
    switch (source) {
      case 'PersonalProfilePage': {
        this.profilepicdata.child(firebase.auth().currentUser.uid).child('profilepicture.png')
        .putString(pic, 'base64', {contentType: 'image/png'}).then((savedpicture) => {
          this.userdata.child(firebase.auth().currentUser.uid).update({'profilepic' : savedpicture.downloadURL});
        });
      }
      case 'DriverLicensePage': {
        
        var uploadTask = this.vaultpicdata.child(firebase.auth().currentUser.uid + '/driverlicensephotos/').child(photoname).put(pic);

        uploadTask.on('state_changed', function(snapshot){
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          console.log('Upload is ' + progress + '% done');
          this.loadProgress = progress;

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
          }
        }, function(error) {
          // Handle unsuccessful uploads
        }, function() {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          var downloadURL = uploadTask.snapshot.downloadURL;
          this.vaultdata.child(this.auth.user.vaultid + '/driverlicenses/' + key + '/photos/').push({'photourl' : downloadURL});
        });
        
        /*this.vaultpicdata.child(firebase.auth().currentUser.uid + '/driverlicensephotos/').child(photoname)
        .putString(pic, 'base64', {contentType: 'image/png'}).then((savedphoto) => {
          this.vaultdata.child(this.auth.user.vaultid + '/driverlicenses/' + key + '/photos/').push({'photourl' : savedphoto.downloadURL});
        });*/
        break;
      }
      case 'CreditCardPage': {
        this.vaultpicdata.child(firebase.auth().currentUser.uid + '/creditcardphotos/').child(photoname)
        .putString(pic, 'base64', {contentType: 'image/png'}).then((savedphoto) => {
          this.vaultdata.child(this.auth.user.vaultid + '/creditcards/' + key + '/photos/').push({'photourl' : savedphoto.downloadURL});
        });
        break;
      }
    }

  }
  
}