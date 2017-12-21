import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';
import { Channel } from './channel.service';
import { OrderGoods } from './order.service';

export interface Goods {
  id?: number
  channelId?: number,
  name: string,
  catalog?: string,
  unit?: string,
  intro?: string,
  sellPrice: number,
  purchasePrice: number,
  createdAt?: Date,
  updatedAt?: Date
}

export interface GoodsInfo extends Goods {
  channelName?: string
  orderSale?: number,
  orderCount?: number
}


@Injectable()
export class GoodsService {
  table: Dexie.Table<Goods, number>;
  channels: Dexie.Table<Channel, number>;
  orderGoods: Dexie.Table<OrderGoods, number>;

  constructor(private dbService: DBService) {
    this.table = this.dbService.table('goods');
    this.channels = this.dbService.table('channels');
    this.orderGoods = this.dbService.table('orderGoods');
  }

  async getAll(): Promise<Array<GoodsInfo>> {
    let goods = await this.table.orderBy("createdAt").reverse().toArray();
    let gwc = new Array<GoodsInfo>();
    for (let g of goods) {
      let c = await this.channels.get(g.channelId);
      let ogs = await this.orderGoods.where("goodsId").equals(g.id).toArray();
      let orderSale = 0;
      let orderCount = ogs.length;
      ogs.forEach(o => {
        orderSale += o.sellPrice * o.quantity;
      });
      gwc.push(this.newGWC(g, c.name, orderSale, orderCount));
    }

    gwc.sort((a: GoodsInfo, b: GoodsInfo): number => {
      return b.orderCount - a.orderCount;
    });
    return gwc;
  }

  newGWC(g: Goods, channelName: string, orderSale: number, orderCount: number): GoodsInfo {
    return {
      id: g.id,
      channelId: g.channelId,
      channelName: channelName,
      name: g.name,
      catalog: g.catalog,
      unit: g.unit,
      intro: g.intro,
      sellPrice: g.sellPrice,
      purchasePrice: g.purchasePrice,
      createdAt: g.createdAt,
      updatedAt: g.updatedAt,
      orderSale: orderSale,
      orderCount: orderCount
    };
  }

  add(data: Goods): Dexie.Promise<number> {
    return this.table.add(data);
  }

  get(id: number): Dexie.Promise<Goods> {
    return this.table.get(id);
  }

  update(data: Goods): Dexie.Promise<number> {
    return this.table.update(data.id, data);
  }

  async remove(id: number): Promise<boolean> {
    let count = await this.orderGoods.where("goodsId").equals(id).count();
    if (count > 0) {
      return false;
    }
    await this.table.delete(id);
    return true;
  }
}

