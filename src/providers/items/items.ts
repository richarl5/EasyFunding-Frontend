import { Injectable } from '@angular/core';

import { Item } from '../../models/item';
import { Api } from '../api/api';
import {HttpHeaders} from "@angular/common/http";
import {share} from "rxjs/operators";

@Injectable()
export class Items {

  constructor(public api: Api) { }
  defaultItem: any = {
    "name": "Burt Bear",
    "profilePic": "assets/img/speakers/bear.jpg",
    "about": "Burt is a Bear.",
  };
  query(params?: any) {
    let token = 'JWT '+localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.get('contract/all', params, {headers:headers}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
        console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }

}
