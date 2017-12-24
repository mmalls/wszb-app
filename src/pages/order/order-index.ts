import { Component, Input } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'
import { DateExt, formatDate } from '../../service/util'

import { OrderEditPage } from './order-edit';
import { OrderInfo, OrderService } from '../../service/order.service'

@Component({
  selector: 'page-order-index',
  templateUrl: 'order-index.html'
})
export class OrderIndexPage extends Prompt {

  @Input() orders: Array<OrderInfo> = new Array<OrderInfo>();

  @Input() beginDataStr: string;
  @Input() endDataStr: string;

  beginDate: Date = new DateExt().addDays(-7);
  endDate: Date = new Date();

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public orderService: OrderService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, toastCtrl)
  }

  ionViewWillEnter() {
    // ?day=12/20
    let dayStr = this.navParams.get("day");
    if (dayStr != undefined && dayStr != "") {
      let now = new Date();
      let nowstr = now.getFullYear() + "/" + dayStr;
      this.beginDate = new Date(nowstr + " 00:00:00");
      this.endDate = new Date(nowstr + " 23:59:59");
    }

    // ?month=17/12
    let monthStr = this.navParams.get("month");
    if (monthStr != undefined) {
      this.beginDate = new Date("20" + monthStr + "/01 00:00:00");
      this.endDate = new Date("20" + monthStr + "/31 23:59:59");
    }

    this.beginDataStr = formatDate(this.beginDate, "yyyy-MM-dd");
    this.endDataStr = formatDate(this.endDate, "yyyy-MM-dd");

    this.listOrders();
  }

  listOrders() {
    this.orderService.getAll(this.beginDate, this.endDate).then(
      (data: OrderInfo[]) => {
        this.orders = data;
      });
  }

  addOrder() {
    this.navCtrl.push(OrderEditPage);
  }

  changeDate(evt: any) {
      this.beginDate = new Date(this.beginDataStr.replace(/-/g, "/") + " 00:00:00");
      this.endDate = new Date(this.endDataStr.replace(/-/g, "/") + " 23:59:59");
      this.listOrders();
  }

  async doDeleteItem(id: number) {
    return this.orderService.remove(id);
  }

  editItem(id: number) {
    this.navCtrl.push(OrderEditPage, { id: id });
  }

  tapItem(id: number) {
    let actionSheet = this.actionCtrl.create({
      title: '操作',
      buttons: [
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
            this.deleteItem(id, "");
          }
        }
      ]
    });

    actionSheet.present();
  }

}
