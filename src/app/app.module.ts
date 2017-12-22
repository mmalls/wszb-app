import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { HomeModule } from '../pages/home/home.moudle';
import { OrderModule } from '../pages/order/order.moudle';
import { CustomerModule } from '../pages/customer/customer.moudle';
import { GoodsModule } from '../pages/goods/goods.moudle'
import { ChannelModule } from '../pages/channel/channel.moudle'
import { MyModule } from '../pages/my/my.moudle'
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HomeModule,
    OrderModule,
    CustomerModule,
    GoodsModule,
    ChannelModule,
    MyModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
