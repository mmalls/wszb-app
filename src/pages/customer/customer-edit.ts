import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'

import { Customer, CustomerService } from '../../service/customer.service'


@Component({
    selector: 'page-customer-edit',
    templateUrl: 'customer-edit.html'
})
export class CustomerEditPage extends Prompt {

    @Input() customer: Customer = {
        weixin: "",
        phone: "",
        receiver: "",
        address: "",
        postCode: ""
    };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public customerService: CustomerService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        super(navCtrl, alertCtrl, toastCtrl)
    }

    ionViewWillEnter() {
        let idStr = this.navParams.get("id");
        if (idStr != undefined && idStr != "") {
            this.customerService.get(parseInt(idStr)).then((c: Customer) => {
                this.customer = c;
            }).catch((e) => {
                this.showToast("加载数据失败", true);
            });
        }
    }

    async saveItem(form : NgForm) {
        if (!form.valid) {
            this.showToast("请输入完整信息", false);
            return
        }

        this.customer.updatedAt = new Date();
        // update
        if (this.customer.id != undefined) {
            try {
                await this.customerService.update(this.customer);
                this.showToast("更新成功", true);
            } catch (e) {
                this.showToast("更新失败", false);
            }
            return;
        }

        // add new
        this.customer.createdAt = new Date();
        try {
            await this.customerService.add(this.customer);
            this.showToast("保存成功", true);
        } catch (e) {
            this.showToast("保存失败", false);
        }
    }
    
}
