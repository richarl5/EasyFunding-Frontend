import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  private data: any;

  // Service message commands
  publishData(data: any) {
    console.log(data);
    this.data = data;
  }
   subscribeData() {
     return this.data;
   }
}
