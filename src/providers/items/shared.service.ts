import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs/Subject';


@Injectable()
export class SharedService {


  private data: any;

  // Service message commands
  publishData(data: any) {
    this.data = data;
  }
   subscribeData() {
     //return {d: this.privateKey, n: this.modulus, e: this.publicKey};
     return this.data;
   }
}
