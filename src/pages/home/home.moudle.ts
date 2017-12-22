import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HomePage } from './home';

import { DBService } from '../../service/db.service';
import { StatsService } from '../../service/stats.service';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
  entryComponents: [
    HomePage
  ],
  providers: [
    DBService,
    StatsService
  ]
})
export class HomeModule {

}