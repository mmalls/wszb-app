import { Component, Input } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'
import { CustomerEditPage } from './customer-edit'

import { CustomerWithOrder, CustomerService } from '../../service/customer.service'

@Component({
  selector: 'page-customer-index',
  templateUrl: 'customer-index.html'
})
export class CustomerIndexPage extends Prompt {

  @Input() customers: Array<CustomerWithOrder> = new Array<CustomerWithOrder>();

  customersbak: Array<CustomerWithOrder> = new Array<CustomerWithOrder>();

  constructor(public navCtrl: NavController,
    public customerService: CustomerService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, toastCtrl)
  }

  ionViewWillEnter() {
    this.customerService.getAll().then((data: CustomerWithOrder[]) => {
      this.customers = data;
      this.customersbak = this.customers;
    });
  }

  addCustomer() {
    this.navCtrl.push(CustomerEditPage);
  }

  async doDeleteItem(id: number) {
    return this.customerService.remove(id);
  }

  editItem(id: number) {
    this.navCtrl.push(CustomerEditPage, { id: id });
  }

  tapItem(id: number) {
    let actionSheet = this.actionCtrl.create({
      title: '操作',
      buttons: [
        {
          text: '下单',
          icon: 'cart',
          handler: () => {
            //this.editItem(id);
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
      this.customers = this.customers.filter((item: CustomerWithOrder) => {
        return item.weixin.toLowerCase().includes(val.toLowerCase()) ||
          item.receiver.toLowerCase().includes(val.toLowerCase()) ||
          item.phone.toLowerCase().includes(val.toLowerCase());
      });
    } else {
      this.customers = this.customersbak;
    }
  }
}
