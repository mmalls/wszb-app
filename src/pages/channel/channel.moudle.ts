import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ChannelIndexPage } from './channel-index';
import { ChannelEditPage } from './channel-edit';

import { DBService } from '../../service/db.service';
import { ChannelService } from '../../service/channel.service';

@NgModule({
  declarations: [
    ChannelIndexPage,
    ChannelEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ChannelIndexPage),
  ],
  entryComponents: [
    ChannelIndexPage,
    ChannelEditPage,
  ],
  providers: [
    DBService,
    ChannelService
  ]
})
export class ChannelModule {}