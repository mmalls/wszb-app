import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'

import { GoodsInfo, GoodsService, Goods } from '../../service/goods.service'
import { Channel, ChannelService } from '../../service/channel.service'
import { ChannelEditPage } from '../channel/channel-edit';
import { toNumber } from '../../service/util';

@Component({
    selector: 'page-goods-edit',
    templateUrl: 'goods-edit.html'
})
export class GoodsEditPage extends Prompt {

    @Input() goods: GoodsInfo = {
        name: "",
        channelId: 0,
        channelName: "",
        catalog: "",
        unit: "",
        intro: "",
        sellPrice: 1.0,
        purchasePrice: 1.0,
    };

    @Input() channels: Array<Channel> = new Array<Channel>();

    @Input() units: string[] = [
        '件', '箱', '包',
        '斤', '两', '个',
        '只', '支', '瓶',
        '盒', '套', '打',
        '袋', '块'
    ]

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public goodsService: GoodsService,
        public channelService: ChannelService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        super(navCtrl, alertCtrl, toastCtrl)
    }

    ionViewWillEnter() {
        this.channelService.getAll().then((data: Channel[]) => {
            this.channels = data;
        });

        let idStr = this.navParams.get("id");
        if (idStr != undefined && idStr != "") {
            this.goodsService.get(parseInt(idStr)).then((c: Goods) => {
                this.goods = c;
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
        this.goods.purchasePrice = toNumber( this.goods.purchasePrice);
        this.goods.sellPrice = toNumber(this.goods.sellPrice);
        if (this.goods.purchasePrice <= 0) {
            this.showToast("进货价必须大于0", false);
            return
        }
        if (this.goods.sellPrice <= 0) {
            this.showToast("零售价必须大于0", false);
            return
        }
    
        this.goods.updatedAt = new Date();
    
        // update
        if (this.goods.id != undefined) {
            try {
                await this.goodsService.update(this.goods as Goods);
                this.showToast("更新成功", true);
            } catch (e) {
                this.showToast("更新失败", false);
            }
            return;
        }

        // add new
        this.goods.createdAt = new Date();
        try {
            await this.goodsService.add(this.goods as Goods);
            this.showToast("保存成功", true);
        } catch (e) {
            this.showToast("保存失败", false);
        }
    }

    compareFn(cid: number, cid2: number): boolean {
        return cid == cid2;
    }

    addChannel() {
        this.navCtrl.push(ChannelEditPage);
    }
}
