import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

import { ModalController, NavController, NavParams } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { PickNotesPage } from '../../pages/picknotes/picknotes';
import { TakePhotoPage } from '../../pages/takephoto/takephoto';

import { TranslateService } from 'ng2-translate/ng2-translate';

@Component({
  selector: 'page-creditcard',
  templateUrl: 'creditcard.html'
})

export class CreditCardPage {

  validationMessage: string;
  showValidationMessage: boolean = false;
  title: string;
  showSkip = false;
  mode: string;
  key: string;
  account: {owner: string, name: string, namelower: string, nickname: string, type: string, number: string, routing: string, notes: string, recentid: string} = {
    owner: '', 
    name: '', 
    namelower: '', 
    nickname: '',
    type: '', 
    number: '', 
    routing: '', 
    notes: '', 
    recentid: ''
  };
  photos = [];

  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
	@Input('expanded') expanded;
	@Input('expandHeight') expandHeight;

	currentHeight: number = 0;

  constructor(
    public renderer: Renderer,
    public modalCtrl: ModalController,
    public nav: NavController, 
    public navParams: NavParams, 
    public translate: TranslateService,
    public auth: AuthService) {

    this.key = navParams.get('key');

    translate.get(["EDIT_TITLE","CREATE_CREDIT_CARD_TITLE"])
    .subscribe((values) => {
      if (this.key === '0') {
        this.title = values.CREATE_CREDIT_CARD_TITLE;
        this.mode = "New";
      } else {
        this.auth.getCreditCard(this.key).once('value').then(snapshot => {
          this.account = snapshot.val();

          var photosRef = this.auth.getCreditCardPhotosRef(this.key);
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
          this.auth.handleRecent(snapshot.key, this.account, 'CreditCardPage');
        });
      }
    });
  }

  ngAfterViewInit(){
    this.renderer.setElementStyle(this.expandWrapper.nativeElement, 'height', '40px');
	}

  ionViewWillEnter() {
    let referrer = this.auth.referrer;
    switch (referrer) {
      case 'CreditCardsPage': {
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

  save() {

    // Validate form data
    if (this.account.owner === 'undefined' || this.account.owner === '') {
      this.expanded = true;
      this.validationMessage = "Please enter card owner"
      return;
    }

    this.account.notes = this.account.notes === undefined ?  '' : this.account.notes;
    this.account.namelower = this.account.name.toLowerCase();
    if (this.mode === 'New') {
      this.auth.AddCreditCard(this.account);
    } else {
      this.auth.updateCreditCard(this.account, this.key);
    }
    this.nav.pop();
  }

  inputChange(account) {
    if (account != '') {
      this.expanded = false;
    } else {
      this.expanded = true;
    }
  }

  pickNotes() {
    this.auth.pwdNotes = this.account.notes;
    this.nav.push(PickNotesPage);
  }

  takePhotopage() {
    let modal = this.modalCtrl.create(TakePhotoPage, { source: 'CreditCardPage', key: this.key });
    modal.present(modal);
    modal.onDidDismiss((data: any[]) => {
      if (data) {
        //this.savePhoto(data);
      }
    });
  }
  
}