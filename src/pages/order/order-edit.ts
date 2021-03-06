import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'

import { OrderInfo, OrderService, OrderGoods } from '../../service/order.service'
import { Customer } from '../../service/customer.service'
import { Goods } from '../../service/goods.service'
import { GoodsEditPage } from '../goods/goods-edit';
import { CustomerEditPage } from '../customer/customer-edit';
import { toNumber } from '../../service/util';

@Component({
    selector: 'page-order-edit',
    templateUrl: 'order-edit.html'
})
export class OrderEditPage extends Prompt {

    @Input() orderInfo: OrderInfo = {
        order: {
            customId: 0,
            notes: "",
            totalSellPrice: 0,
            discount: 0
        },
        goods: [{
            orderId: 0,
            goodsId: 0,
            goodsName: "",
            sellPrice: 0,
            purchasePrice: 0,
            quantity: 0
        }],
        customer: {
            weixin: "",
            phone: "",
            receiver: "",
            address: "",
        },
    };

    @Input() goods = new Array<Goods>();
    @Input() customers = new Array<Customer>();

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public orderService: OrderService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        super(navCtrl, alertCtrl, toastCtrl)
    }

    ionViewWillEnter() {
        let idStr = this.navParams.get("id");
        if (idStr != undefined && idStr != "") {
            this.orderService.get(parseInt(idStr)).then((c: OrderInfo) => {
                this.orderInfo = c;
            }).catch((e) => {
                this.showToast("加载数据失败", true);
            });
        }

        this.orderService.getGoods().then((data: Goods[]) => {
            this.goods = data

            let customerIdStr = this.navParams.get("customerId");
            if (customerIdStr != undefined && customerIdStr != "") {
                this.orderInfo.order.customId = parseInt(customerIdStr);
                this.selectCustomer(this.orderInfo.order.customId);
            }
        });

        this.orderService.getCustomers().then((data: Customer[]) => {
            this.customers = data

            let goodsIdStr = this.navParams.get("goodsId");
            if (goodsIdStr != undefined && goodsIdStr != "") {
                this.orderInfo.goods[0].id = parseInt(goodsIdStr);
                this.selectGoods(0, this.orderInfo.goods[0].id);
            }
        });
    }

    invalidGoodsInput(): boolean {
        let i = 0;
        this.orderInfo.goods.forEach(g => {
            i += g.goodsId;
        })
        return i == 0;
    }

    async saveItem(form: NgForm) {
        if (!form.valid || this.orderInfo.order.customId == 0 || this.invalidGoodsInput()) {
            this.showToast("请输入完整信息", false);
            return
        }

        this.orderInfo.order.discount = toNumber(this.orderInfo.order.discount);
        this.orderInfo.order.totalSellPrice = toNumber(this.orderInfo.order.totalSellPrice);

        if (this.orderInfo.order.discount < 0) {
            this.showToast("优惠必须大于或等于0", false);
            return
        }

        if (this.orderInfo.order.totalSellPrice < 0) {
            this.showToast("总售价必须大于或等于0", false);
            return
        }

        for (let g of this.orderInfo.goods) {
            if (g.quantity <= 0) {
                this.showToast("购买数量必须大于0", false);
                return
            }

            if (g.purchasePrice <= 0) {
                this.showToast("进货价必须大于0", false);
                return
            }

            if (g.sellPrice <= 0) {
                this.showToast("零售价必须大于0", false);
                return
            }
        }

        // update
        if (this.orderInfo.order.id != undefined) {
            try {
                await this.orderService.update(
                    this.orderInfo.order,
                    this.orderInfo.goods);
                this.showToast("更新成功", true);
            } catch (e) {
                this.showToast("更新失败", false);
            }
            return;
        }

        // add new
        try {
            await this.orderService.add(
                this.orderInfo.order,
                this.orderInfo.goods);
            this.showToast("保存成功", true);
        } catch (e) {
            this.showToast("保存失败", false);
        }
    }

    selectGoods(index: number, id: number) {
        console.log("selectGoods", index, id);
        this.orderService.getGoodsById(id).then((d: Goods) => {
            this.orderInfo.goods[index] = {
                goodsId: d.id,
                goodsName: d.name,
                sellPrice: d.sellPrice,
                purchasePrice: d.purchasePrice,
                quantity: 1,
                unit: d.unit,
            };
            this.changeQuantity("", index);
        });
    }

    selectCustomer(id: number) {
        console.log("selectCustomer", id);
        this.orderService.getCustomerById(id).then((d: Customer) => {
            this.orderInfo.customer = d;
        });
    }

    changeQuantity(type: string, index: number) {
        if (type == 'sub') {
            if (this.orderInfo.goods[index].quantity > 1) {
                this.orderInfo.goods[index].quantity--;
            }
        } else if (type == 'add') {
            this.orderInfo.goods[index].quantity++;
        }

        console.log("changeQuantity", index);
        this.orderInfo.order.totalSellPrice = 0;
        this.orderInfo.goods.forEach((g: OrderGoods) => {
            g.purchasePrice = toNumber(g.purchasePrice);
            g.quantity = toNumber(g.quantity);
            g.sellPrice = toNumber(g.sellPrice);
            this.orderInfo.order.totalSellPrice += g.sellPrice * g.quantity;
        });
    }
    
    addBuy() {
        this.orderInfo.goods.push({
            orderId: 0,
            goodsId: 0,
            goodsName: "",
            sellPrice: 0,
            purchasePrice: 0,
            quantity: 0
        });
    }

    removeBuy(idx: number) {
        if (idx < this.orderInfo.goods.length) {
            this.orderInfo.goods = this.orderInfo.goods.splice(idx, idx + 1);
        }
    }

    compareFn(cid: number, cid2: number): boolean {
        return cid == cid2;
    }

    addGoods() {
        this.navCtrl.push(GoodsEditPage);
    }

    addCustomer() {
        this.navCtrl.push(CustomerEditPage);
    }
}
