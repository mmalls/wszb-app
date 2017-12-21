import { Component, Input } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';

import { Prompt } from '../../mixins/prompt'
import { ChannelEditPage } from './channel-edit';

import { ChannelInfo, ChannelService } from '../../service/channel.service'

@Component({
  selector: 'page-channel-index',
  templateUrl: 'channel-index.html'
})
export class ChannelIndexPage extends Prompt {

  @Input() channels: Array<ChannelInfo> = new Array<ChannelInfo>();

  constructor(public navCtrl: NavController,
    public channelService: ChannelService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, toastCtrl)
  }

  ionViewWillEnter() {
    this.channelService.getAll().then((data: ChannelInfo[]) => {
      this.channels = data;
    });
  }

  addChannel() {
    this.navCtrl.push(ChannelEditPage);
  }

  async doDeleteItem(id: number) {
    return this.channelService.remove(id);
  }

  editItem(id: number) {
    this.navCtrl.push(ChannelEditPage, { id: id });
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
            this.deleteItem(id, "商品");
          }
        }
      ]
    });

    actionSheet.present();
  }
}
