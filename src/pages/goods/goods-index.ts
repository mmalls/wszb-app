import { Component, Input } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'
import { GoodsEditPage } from './goods-edit'
import { OrderEditPage } from '../order/order-edit';

import { GoodsInfo, GoodsService, Goods } from '../../service/goods.service'

@Component({
  selector: 'page-goods-index',
  templateUrl: 'goods-index.html'
})
export class GoodsIndexPage extends Prompt {

  @Input() goods: Array<GoodsInfo> = new Array<GoodsInfo>();

  goodbak: Array<GoodsInfo> = new Array<GoodsInfo>();

  constructor(public navCtrl: NavController,
    public goodsService: GoodsService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, toastCtrl)
  }

  ionViewWillEnter() {
    this.goodsService.getAll().then((data: GoodsInfo[]) => {
      this.goods = data;
      this.goodbak = this.goods;
    });
  }

  addGoods() {
    this.navCtrl.push(GoodsEditPage);
  }

  async doDeleteItem(id: number) {
    return this.goodsService.remove(id);
  }

  editItem(id: number) {
    this.navCtrl.push(GoodsEditPage, { id: id });
  }

  tapItem(id: number) {
    let actionSheet = this.actionCtrl.create({
      title: '操作',
      buttons: [
        {
          text: '下单',
          icon: 'cart',
          handler: () => {
            this.navCtrl.push(OrderEditPage, {"goodsId": id});
          }
        },
        {
          text: '修改',
          icon: 'list-box',
          handler: () => {
            this.editItem(id);
          }
        },
        {
          text: '删除',
          icon: 'trash',
          handler: () => {
            this.deleteItem(id, "订单");
          }
        }
      ]
    });

    actionSheet.present();
  }

  filterItems(evt: any) {
    let val = evt.target.value;

    if (val && val.trim() !== '') {
      this.goods = this.goods.filter((item: Goods) => {
        return item.name.toLowerCase().includes(val.toLowerCase());
      });
    } else {
      this.goods = this.goodbak;
    }
  }
}
