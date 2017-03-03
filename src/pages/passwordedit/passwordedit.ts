import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

@Component({
  templateUrl: 'passwordedit.html'
})

export class PasswordEditPage {

  title: string;
  mode: string;
  account: {name: string, icon: string, color: string} = {
    name: '', 
    icon: '', 
    color: ''
  };
  icons: any;
  faicons: any;

  constructor(
    public nav: NavController, 
    public http: Http) {
    this.title = 'test title';
  }

  ionViewWillEnter() {
    
  }

  save() {  
    this.nav.pop();
  }

  load(): any {
    if (this.icons) {
      return Observable.of(this.icons);
    } else {
      this.http.get('assets/data/fadata.json').map(res => res.json()).subscribe(data => {
        this.icons = data.icons;
      });
    }
  }

  loadIcons() {
    this.load();
  }

  selectIcon(icon) {
    console.log(icon);
  }
  
}