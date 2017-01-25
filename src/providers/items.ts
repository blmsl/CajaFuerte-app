import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Item } from '../models/item';

@Injectable()
export class Items {

  constructor(public http: Http) {
  }

  query(params?: any) {
    
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }

}
