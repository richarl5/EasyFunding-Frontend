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
  items: any;
  query(params?: any) {
    let token = 'JWT '+ localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.get('contract/all', params, {headers:headers}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res);
      this.items=res;
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  add(item: Item) {
    let token = 'JWT '+ localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.post('contract', item, {headers:headers}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  getOneContract(params?: any) {
    let token = 'JWT '+ localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.get('contract', {id: params}, {headers:headers}).share();
    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }

  addDonation(donation: Item) {
    let token = 'JWT '+ localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.post('donation', donation, {headers:headers}).share();
    seq.subscribe((res: any) => {
      console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }
  executeDonation(donation: any) {
    let token = 'JWT '+ localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", token);

    let seq = this.api.post('contract/unlock', donation, {headers:headers}).share();
    seq.subscribe((res: any) => {
      console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
    return seq;
  }
  buscar(params?: any) {
    if (!params) {
      return this.items;
    }

    return this.items.filter((item) => {
      for (let key in params) {
        let field = item[key];
        if (typeof field == 'string' && field.toLowerCase().indexOf(params[key].toLowerCase()) >= 0) {
          return item;
        } else if (field == params[key]) {
          return item;
        }
      }
      return null;
    });
  }

  delete(item: Item) {
  }

}
