import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { OrderIndexPage } from './order-index';
import { OrderEditPage } from './order-edit';

import { DBService } from '../../service/db.service';
import { OrderService } from '../../service/order.service';

@NgModule({
  declarations: [
    OrderIndexPage,
    OrderEditPage
  ],
  imports: [
    IonicPageModule.forChild(OrderIndexPage),
  ],
  entryComponents: [
    OrderIndexPage,
    OrderEditPage
  ],
  providers: [
    DBService,
    OrderService
  ]
})
export class OrderModule {}