import { Component, Input, ViewEncapsulation } from '@angular/core';

import { NavController, ToastController, ViewController } from 'ionic-angular';
import { ERR } from 'ngx-gesture-password';

import { SysDataService } from '../../service/sysdata.service';

@Component({
    selector: 'page-my-lock',
    templateUrl: 'my-lock.html',
    encapsulation: ViewEncapsulation.None
})
export class MyLockPage {

    @Input() pwd: string;

    @Input() ltype: string = "recorder";

    @Input() options: any = {
        //bgColor: '#292b38',
        focusColor: '#5aa5fe',
        fgColor: '#878aa1',
        num: 4,
        passwords: Array(16).fill(0).map((i, index) => String.fromCharCode(index + 65))
    };

    constructor(public navCtrl: NavController,
        public toastCtrl: ToastController,
        public viewCtrl: ViewController,
        public sysDataService: SysDataService) {
    }

    ionViewWillEnter () {
    }

    onError(data: any) {

    }

    onChecked(data: any) {
        console.log('onChecked', data);
        switch (data.err) {
            case ERR.NOT_ENOUGH_POINTS:
                this.showToast('至少4个节点以上');
                break;
            case ERR.PASSWORD_MISMATCH:
                this.showToast('密码检验失败');
                break;
            default:
                this.showToast('密码检验成功');
                break;
        }
    }

    onBeforeRepeat(data: any) {
        console.log('onBeforeRepeat', data);
        switch (data.err) {
            case ERR.NOT_ENOUGH_POINTS:
                this.showToast('至少4个节点以上');
                break;
            default:
                this.showToast('请再次绘制相同图案');
                break;
        }
    }

    onAfterRepeat(data: any) {
        console.log('onAfterRepeat', data);
        switch (data.err) {
            case ERR.NOT_ENOUGH_POINTS:
                this.showToast('至少4个节点以上');
                break;
            case ERR.PASSWORD_MISMATCH:
                this.showToast('两次密码不匹配');
                break;
            default:
                this.showToast('新密码已经生效');
                this.sysDataService.setPwd(data.result);
                this.sysDataService.openLock();
                this.dismiss();
                break;
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
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