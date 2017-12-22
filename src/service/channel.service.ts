import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';
import { Goods } from './goods.service';
import { OrderGoods } from './order.service';

export interface Channel {
  id?: number,
  name: string,
  phone: string,
  intro?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export interface ChannelInfo extends Channel {
  orderSale?: number,
  orderCount?: number
}

@Injectable()
export class ChannelService {
  table: Dexie.Table<Channel, number>;
  goods: Dexie.Table<Goods, number>;
  orderGoods: Dexie.Table<OrderGoods, number>;

  constructor(private dbService: DBService) {
    this.table = this.dbService.table('channels');
    this.goods = this.dbService.table('goods');
    this.orderGoods = this.dbService.table('orderGoods');
  }

  async getAll(): Promise<Array<ChannelInfo>> {
    let cs = await this.table.orderBy("createdAt").reverse().toArray();
    let cis = new Array<ChannelInfo>();
    for (let c of cs) {
      let orderSale = 0;
      let orderCount = 0;

      let goods = await this.goods.where("channelId").equals(c.id).toArray();
      //console.log("goods", c.name, goods.length);
      for (let g of goods ) {
        let ogs = await this.orderGoods.where("goodsId").equals(g.id).toArray();
        orderCount += ogs.length;
        console.log("orderGoods", ogs.length);
        ogs.forEach(o => {
          orderSale += o.sellPrice * o.quantity;
        });
      };

      cis.push(this.newCI(c, orderSale, orderCount));
    }
    
    cis.sort((c1: ChannelInfo, c2: ChannelInfo): number => {
      return c2.orderSale - c1.orderSale;
    })
    return cis;
  }

  newCI(c: Channel, orderSale: number, orderCount: number): ChannelInfo {
    return {
      id: c.id,
      name: c.name,
      phone: c.phone,
      intro: c.intro,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      orderSale: orderSale,
      orderCount: orderCount
    }
  }

  add(data: Channel): Dexie.Promise<number> {
    return this.table.add(data);
  }

  get(id: number): Dexie.Promise<Channel> {
    return this.table.get(id);
  }

  async update(data: Channel): Dexie.Promise<number> {
    return this.table.update(data.id, data);
  }

  async remove(id: number): Promise<boolean> {
    let count = await this.goods.where("channelId").equals(id).count();
    if (count > 0) {
      return false;
    }
    await this.table.delete(id);
    return true;
  }

}

