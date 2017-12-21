import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'

import { Channel, ChannelService } from '../../service/channel.service'

@Component({
    selector: 'page-channel-edit',
    templateUrl: 'channel-edit.html'
})
export class ChannelEditPage extends Prompt {

    @Input() channel: Channel = {
        name: "",
        phone: "",
        intro: ""
    };

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public channelService: ChannelService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
        super(navCtrl, alertCtrl, toastCtrl)
    }

    ionViewWillEnter() {
        // edit a existed item
        let idStr = this.navParams.get("id");
        if (idStr != undefined && idStr != "") {
            this.channelService.get(parseInt(idStr)).then((c: Channel) => {
                this.channel = c;
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

        this.channel.updatedAt = new Date();
        // update
        if (this.channel.id != undefined) {
            try {
                await this.channelService.update(this.channel);
                this.showToast("更新成功", true);
            } catch (e) {
                this.showToast("更新失败", false);
            }
            return;
        }

        // add new
        this.channel.createdAt = new Date();
        try {
            await this.channelService.add(this.channel);
            this.showToast("保存成功", true);
        } catch (e) {
            this.showToast("保存失败", false);
        }
    }
}
