import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, AlertController, ToastController, ActionSheetController, ModalController } from 'ionic-angular';


import { StatsService } from '../../service/stats.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { MyLockPage } from './my-lock';
import { SysDataService, AppState } from '../../service/sysdata.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'page-my-index',
  templateUrl: 'my-index.html'
})
export class MyIndexPage {

  @Input() serverAddr: string = "http://192.168.199.112:8443";

  @Input() openlock: boolean = false;

  @Input() isExistedPwd: boolean = false;

  @Input() test: Observable<boolean>;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public actionCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public http: HttpClient,
    public statsService: StatsService,
    public sysDataService: SysDataService,
    private store: Store<AppState>) {

      this.test = this.store.select("islock");
  }

  ionViewWillEnter () {
    this.sysDataService.getLock().then(d => {
      if (d == "true") {
        this.openlock = true;
        this.checkOpenLock();
      }
    })
  }

  private checkOpenLock() {
    this.sysDataService.getPwd().then(d => {
      if (d != "") {
        this.isExistedPwd = true;
        this.sysDataService.openLock();
      }
    });
  }

  toggleChanged() {
    this.sysDataService.setLock(this.openlock ? "true" : "false");
    if (this.openlock) {
      this.checkOpenLock();
    } else {
      this.sysDataService.closeLock();
    }
  }

  async backupData() {
    console.log('backupData');
    let body = await this.statsService.exportDatas();
    this.http.post(this.serverAddr + "/rest/v1/sync", body).subscribe(
      (v: any) => {
        this.showToast("备份数据成功");
      },
      (err: HttpErrorResponse) => {
        if (err.status == 200) {
          this.showToast("备份数据成功");
        } else {
          this.showToast("备份数据失败");
        }
      }
    );
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

  settingPwd() {
    let modal = this.modalCtrl.create(MyLockPage);
    modal.present();
  }
}