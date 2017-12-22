import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';
import { Order } from './order.service'

export interface Customer {
  id?: number
  weixin: string,
  phone: string,
  receiver: string,
  address: string,
  postCode?: string,
  notes?: string,
  createdAt?: Date,
  updatedAt?: Date
}

export interface CustomerWithOrder extends Customer {
  orderSale?: number,
  orderCount?: number
}

@Injectable()
export class CustomerService {
  table: Dexie.Table<Customer, number>;
  orders: Dexie.Table<Order, number>;


  constructor(private dbService: DBService) {
    this.table = this.dbService.table('customers');
    this.orders = this.dbService.table('orders');
  }

  async getAll(): Promise<Array<CustomerWithOrder>> {
    let ret = new Array<CustomerWithOrder>();
    let cs = await this.table.orderBy("createdAt").reverse().toArray();
    for (let c of cs) {
      let os = await this.orders.where("customId").equals(c.id).toArray();
      let orderSale = 0;
      os.forEach((o: Order) => {
        orderSale += o.totalSellPrice;
      });
      let orderCount = os.length;
      ret.push(this.newCWO(c, orderSale, orderCount));
    }
    
    ret.sort((a: CustomerWithOrder, b: CustomerWithOrder): number => {
      return b.orderCount - a.orderCount;
    });
    return ret;
  }

  newCWO(c: Customer, orderSale?: number, orderCount?: number): CustomerWithOrder {
    return {
      id: c.id,
      weixin: c.weixin,
      phone: c.phone,
      receiver: c.receiver,
      address: c.address,
      postCode: c.postCode,
      notes: c.notes,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      orderSale: orderSale,
      orderCount: orderCount
    };
  }

  add(data: Customer): Dexie.Promise<number> {
    return this.table.add(data);
  }

  get(id: number): Dexie.Promise<Customer> {
    return this.table.get(id);
  }

  async update(data: Customer): Dexie.Promise<number> {
    return this.table.update(data.id, data);
  }

  async remove(id: number): Promise<boolean> {
    let count = await this.orders.where("customId").equals(id).count();
    if (count > 0) {
      return false;
    }
    await this.table.delete(id);
    return true;
  }
}

