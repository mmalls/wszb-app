
import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';
import { Customer } from './customer.service'
import { Goods, GoodsService } from './goods.service'
import { formatData } from './util'

export interface Order {
  id?: number
  customId?: number,
  notes?: string,
  totalSellPrice: number,
  discount: number,
  createdAt?: Date,
  updatedAt?: Date
}

export interface OrderGoods {
  id?: number
  orderId?: number,
  goodsId?: number,
  goodsName?: string,
  sellPrice: number,
  purchasePrice: number,
  quantity: number,
  unit?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export interface OrderInfo {
  order: Order
  goods: OrderGoods[],
  customer?: Customer,
  earning?: number,
  createdAt?: string,
}

@Injectable()
export class OrderService {
  orders: Dexie.Table<Order, number>;
  orderGoods: Dexie.Table<OrderGoods, number>;
  customers: Dexie.Table<Customer, number>;
  goods: Dexie.Table<Goods, number>;

  constructor(private dbService: DBService) {
    this.orders = this.dbService.table('orders');
    this.orderGoods = this.dbService.table('orderGoods');
    this.customers = this.dbService.table('customers');
    this.goods = this.dbService.table('goods');
  }

  async getCustomers(): Dexie.Promise<Array<Customer>> {
    return this.customers.toArray();
  }

  async getCustomerById(id: number): Dexie.Promise<Customer> {
    return this.customers.get(id);
  }

  async getGoods(): Dexie.Promise<Array<Goods>> {
    return this.goods.toArray();
  }

  async getGoodsById(id: number): Dexie.Promise<Goods> {
    return this.goods.get(id);
  }

  async getAll(begin: Date, end: Date): Promise<Array<OrderInfo>> {
    let ret = new Array<OrderInfo>();
    let orders = await this.orders.where("createdAt").between(begin, end, true, true).reverse().toArray();

    orders.forEach(async (o: Order) => {
      ret.push(await this.getByOrder(o));
    });

    return ret;
  }

  async add(order: Order, goods: OrderGoods[]): Promise<void> {
    await this.dbService.transaction("rw", this.orders, this.orderGoods,
      async () => {
        await this.saveOrderGoods(order, goods);
      });
    return
  }

  async saveOrderGoods(order: Order, goods: OrderGoods[]) {
    order.createdAt = new Date();
    order.updatedAt = new Date();
    const orderId = await this.orders.add(order);
    for (let g of goods) {
      g.orderId = orderId;
    }
    await this.orderGoods.bulkAdd(goods);
  }

  async get(id: number): Promise<OrderInfo> {
    let order = await this.orders.get(id);
    return this.getByOrder(order);
  }

  async getByOrder(order: Order): Promise<OrderInfo> {
    let goods = await this.orderGoods.where("orderId").equals(order.id).toArray();
    let customer = await this.customers.get(order.customId);
    let purchasePrice = 0;
    for (let c of goods) {
      purchasePrice += c.purchasePrice * c.quantity;
    }
    if (order.discount == undefined) {
      order.discount = 0;
    }
    return {
      order: order,
      goods: goods,
      customer: customer,
      earning: order.totalSellPrice - purchasePrice - order.discount,
      createdAt: formatData(order.createdAt, "yyyy-MM-dd hh:mm:ss")
    };
  }

  async update(order: Order, goods: OrderGoods[]): Promise<void> {
    await this.dbService.transaction("rw", this.orders, this.orderGoods,
      async () => {
        await this.orderGoods
          .where("orderId")
          .equals(order.id)
          .delete();
        await this.updateOrderGoods(order, goods);
      });
    return
  }

  async updateOrderGoods(order: Order, goods: OrderGoods[]): Promise<void> {
    order.updatedAt = new Date();

    await this.orders.put(order);
    for (let g of goods) {
      g.orderId = order.id;
    }
    await this.orderGoods.bulkAdd(goods);
    return
  }

  async remove(id: number): Promise<boolean> {
    await this.dbService.transaction("rw", this.orders, this.orderGoods,
      async () => {
        await this.orders.delete(id);
        await this.orderGoods.where("orderId").equals(id).delete();
      });
    return true;
  }
}
