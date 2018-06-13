import { Injectable } from '@angular/core';
import * as bigInt from 'big-integer/BigInteger';
import * as shajs from 'sha.js';

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
  generateKeys() {
    let base=bigInt(2);
    let e= bigInt(65537);
    let p=bigInt.zero, q=bigInt.zero, n=bigInt.zero, d=bigInt.zero;

    while (!bigInt(p).isPrime()) {
      p = bigInt.randBetween(base.pow(255), base.pow(256).subtract(1));
    }
    while (!bigInt(q).isPrime()) {
      q = bigInt.randBetween(base.pow(255), base.pow(256).subtract(1));
    }
    let phi = p.subtract(1).multiply(q.subtract(1));
    n = p.multiply(q);
    d = e.modInv(phi);
    console.log('Client Keys Generated');
    let myKeys = {e: e.toString(), n: n.toString(), d: d.toString()};
    this.data = myKeys;
    //localStorage.setItem('keys', JSON.stringify(myKeys));
    return myKeys;
  };
  signMessage(send, keys){
    let string = send.contract_id +"."+ send.user_id +"."+ send.amount_donated;
    let hash = shajs('sha256').update(string).digest('hex');
    let messageS=bigInt(hash, 16);
    return messageS.modPow(bigInt(keys.d),bigInt(keys.n)).toString();
  }
}
