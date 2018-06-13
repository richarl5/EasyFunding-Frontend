import {Component, Input} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Items } from '../../providers/items/items';
import * as bigInt from 'big-integer/BigInteger';
import * as shajs from 'sha.js';
import {SharedService} from "../../providers/items/shared.service";

export interface CountdownTimer {
  seconds: number;
  secondsRemaining: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: any;
}

@IonicPage()
@Component({
  selector: 'page-item-detail',
  templateUrl: 'item-detail.html'
})
export class ItemDetailPage {
  item: any;
  amount_now: any;
  profilePic = "assets/img/speakers/bear.jpg";
  keys: any;
  constructor(public navCtrl: NavController, navParams: NavParams,public items: Items,
              private alertCtrl: AlertController, public toastCtrl: ToastController, public sharedService: SharedService) {
    this.item = navParams.get('item').contract;
    this.amount_now = navParams.get('item').amount_now;

    this.keys = this.sharedService.subscribeData();
  }

  cards() {
    this.navCtrl.push('CardsPage');
  }
  content() {
    this.navCtrl.push('ContentPage');
  }
  signup() {
    this.navCtrl.push('ListMasterPage');
  }
  /////////
  @Input() timeInSeconds: number;
  timer: CountdownTimer;

  ngOnInit() {
    let dateEntered = new Date(this.item.expireDate);
    let now = new Date();
    let difference = dateEntered.getTime() - now.getTime();
    this.timeInSeconds = difference/1000;
    this.initTimer();
  }
  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    if (!this.timeInSeconds) { this.timeInSeconds = 3600*24; }

    this.timer = <CountdownTimer>{
      seconds: this.timeInSeconds,
      runTimer: false,
      hasStarted: false,
      hasFinished: false,
      secondsRemaining: this.timeInSeconds
    };

    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.startTimer();
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      this.timer.secondsRemaining--;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
      if (this.timer.secondsRemaining > 0) {
        this.timerTick();
      } else {
        this.timer.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    const days = Math.floor((secNum / 3600) / 24);
    const hours = Math.floor((secNum - days*24*3600) / 3600);
    const minutes = Math.floor((secNum - (hours * 3600) - (days*24*3600)) / 60);
    const seconds = secNum - (hours * 3600) - (minutes * 60) - (days*24*3600);
    let hoursString = '';
    let daysString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? '0' + hours : hours.toString();
    daysString = (days < 10) ? '0' + days : days.toString();
    minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
    secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
    return {daysString, hoursString, minutesString, secondsString};
  }
  /////////
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Donate',
      inputs: [
        {
          name: 'amount_donated',
          placeholder: 'Enter quantity.',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Donate',
          handler: data => {
            //let keys = JSON.parse(localStorage.getItem('keys'));
            let send = {contract_id: this.item._id, user_id: localStorage.getItem('_id'), amount_donated: data.amount_donated, signature: ''};
            let keys = this.keys;
            send.signature = this.sharedService.signMessage(send, keys);
            console.log(send);

            this.items.addDonation(send).subscribe((res: any) => {
              console.log(res);
              this.presentToast(res['message']);
            }, err => {
              this.presentToast(err.error['message']);
            });
            console.log(send);
          }
        }
      ]
    });
    alert.present();
  }
  execute() {
    let alert = this.alertCtrl.create({
      title: 'Execute contract',
      message: 'Are you sure? Are you rich?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Shut up and take my money',
          handler: data => {
            let send = {contract_id: this.item._id, user_id: localStorage.getItem('_id')};
            this.items.executeDonation(send).subscribe((res: any) => {
              console.log(res);
              this.presentToast(res['message']);
            }, err => {
              this.presentToast(err.error['message']);
            });
            console.log(send);
          }
        }
      ]
    });
    alert.present();
  }
  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });
    toast.present();
  }
}
