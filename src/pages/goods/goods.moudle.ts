import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { GoodsIndexPage } from './goods-index';
import { GoodsEditPage } from './goods-edit';

import { DBService } from '../../service/db.service';
import { GoodsService } from '../../service/goods.service';
import { ChannelService } from '../../service/channel.service';

@NgModule({
  declarations: [
    GoodsIndexPage,
    GoodsEditPage
  ],
  imports: [
    IonicPageModule.forChild(GoodsIndexPage),
  ],
  entryComponents: [
    GoodsIndexPage,
    GoodsEditPage
  ],
  providers: [
    DBService,
    GoodsService,
    ChannelService
  ]
})
export class GoodsModule {}