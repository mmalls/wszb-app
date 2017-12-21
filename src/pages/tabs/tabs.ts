import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { ChannelIndexPage } from '../channel/channel-index';
import { GoodsIndexPage } from '../goods/goods-index';
import { CustomerIndexPage } from '../customer/customer-index';
import { OrderIndexPage } from '../order/order-index';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabs = [
    { root: HomePage, title: "首页", icon: "home" },
    { root: OrderIndexPage, title: "订单", icon: "list-box" },
    { root: CustomerIndexPage, title: "客户", icon: "contacts" },
    { root: GoodsIndexPage, title: "商品", icon: "cart" },
    { root: ChannelIndexPage, title: "渠道", icon: "boat" }
  ];
  constructor() {

  }
}
