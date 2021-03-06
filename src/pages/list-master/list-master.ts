import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/items/items';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {
  currentItems: Item[];
  profilePic = "assets/img/speakers/Donacion.png";

  constructor(public navCtrl: NavController, public items: Items, public modalCtrl: ModalController) {
    this.getContractList();
  }
  getContractList (){
    this.items.query().subscribe((res: any) => {
      this.currentItems = res;
      console.log(this.currentItems);
    }, err => {
      console.error('ERROR', err);
    });
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
  }

  /**
   * Prompt the user to add a new item. This shows our ItemCreatePage in a
   * modal and then adds the new item to our data source if the user created one.
   */
  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        console.log(item);
        //item.actual = 0;
        this.items.add(item);
        this.getContractList();
      }
    });
    addModal.present();
    this.getContractList();
  }

  /**
   * Delete an item from the list of items.
   */
  deleteItem(item) {
    this.items.delete(item);
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item: Item) {
    this.items.getOneContract(item._id).subscribe((res: any) => {
      this.navCtrl.push('ItemDetailPage', {
        item: res
      });
      console.log(res);
    }, err => {
      console.error('ERROR', err);
    });
  }
}
