import { NavController, AlertController, ToastController } from 'ionic-angular';

// Prompt Mixin
export class Prompt {
    constructor(public navCtrl: NavController,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController) {
    }

    deleteItem(id: number, msg?: string) {
        let confirm = this.alertCtrl.create({
            title: '确认是否删除？',
            message: '删除时会检查是否存在关联'+msg+'，一旦删除不可恢复！',
            buttons: [
                {
                    text: '取消',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: '确认',
                    handler: async () => {
                        try {
                            let ret = await this.doDeleteItem(id);
                            if (ret) {
                                this.showToast("删除成功！", false, true);
                            } else {
                                this.showToast('删除失败！,存在关联' + msg);
                            }
                        } catch (e) {
                            this.showToast('删除失败！');
                        }
                    }
                }
            ]
        });
        confirm.present();
    }

    async doDeleteItem(id: number): Promise<boolean> {
        return false;
    }

    showToast(message: string, back?: boolean, reload?: boolean) {
        const toast = this.toastCtrl.create({
            message: message,
            position: 'top',
            duration: 1200
        });

        toast.onDidDismiss(() => {
            console.info('Toast onDidDismiss()'); 
        });
        toast.present();
        if (back) {
            this.navCtrl.setRoot(this.navCtrl.getPrevious().component);
        }
        if (reload) {
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
        }
    }
}
