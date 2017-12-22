import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, ToastController, ActionSheetController } from 'ionic-angular';


import { StatsService } from '../../service/stats.service';

@Component({
  selector: 'page-my-index',
  templateUrl: 'my-index.html'
})
export class MyIndexPage {

  @Input() serverAddr: string = "http://192.168.199.112:8443";

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController,
    public http: HttpClient,
    public statsService: StatsService) {
  }

  toggleChanged(bind: any, type: string) {
    console.log('toggleChanged', bind);
  }

  backupData() {

  }

  async recoveryData() {
    console.log('recoveryData');
    this.http.get(this.serverAddr + "/rest/v1/recove").subscribe(
      async data => {
        await this.statsService.recoverDatas(data);
        this.showToast("恢复数据成功");
      },
      err => {
        console.log('recovery data went wrong!', err);
        this.showToast("恢复数据失败");
      }
    );
  }

  showToast(message: string) {
    const toast = this.toastCtrl.create({
      message: message,
      position: 'top',
      duration: 1200
    });

    toast.present();
  }
}