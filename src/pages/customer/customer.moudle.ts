import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CustomerIndexPage } from './customer-index';
import { CustomerEditPage } from './customer-edit';

import { DBService } from '../../service/db.service';
import { CustomerService } from '../../service/customer.service';

@NgModule({
  declarations: [
    CustomerIndexPage,
    CustomerEditPage
  ],
  imports: [
    IonicPageModule.forChild(CustomerIndexPage),
  ],
  entryComponents: [
    CustomerIndexPage,
    CustomerEditPage
  ],
  providers: [
    DBService,
    CustomerService
  ]
})
export class CustomerModule {}