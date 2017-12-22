import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DateExt, formatDate } from './util';
import { DBService } from './db.service';
import { Order, OrderGoods } from './order.service';
import { Channel } from './channel.service';
import { Customer } from './customer.service';
import { Goods } from './goods.service';

export interface StatsInfo {
    totalOrder: number, // 总订单数
    totalQuantity: number, // 总件数
    totalIncoming: number, // 总利润
    totalSellPrice: number, // 总销售
    totalCustomer: number, // 总客户数
    totalGoods: number,  // 总商品数

    items: Array<StatsItem> //统计项
}

export interface StatsItem {
    key: string,  //统计单项key, 17/12 , 11/02
    totalSellPrice: number, // 单项总销售
    totalIncoming: number// 单项总利润
}

export interface ExportInfo {
    channels: Array<Channel>,
    customs: Array<Customer>,
    goods: Array<Goods>,
    orders: Array<Order>,
    orderGoods: Array<OrderGoods>
}

@Injectable()
export class StatsService {
    channels: Dexie.Table<Channel, number>;
    goods: Dexie.Table<Goods, number>;
    customers: Dexie.Table<Customer, number>;
    orderGoods: Dexie.Table<OrderGoods, number>;
    orders: Dexie.Table<Order, number>;

    constructor(private dbService: DBService) {
        this.channels = this.dbService.table('channels');
        this.goods = this.dbService.table('goods');
        this.customers = this.dbService.table('customers');
        this.orderGoods = this.dbService.table('orderGoods');
        this.orders = this.dbService.table('orders');
    }

    async queryOrderStats(by: string): Promise<StatsInfo> {
        let end = new DateExt();
        let begin = new DateExt();
        let format = 'MM/dd'

        if (by == 'month') {
            begin.addMonths(-1)
        } else if (by == 'week') {
            begin.addDays(-7)
        } else if (by == 'year') {
            begin.addYears(-1)
            format = 'yy/MM'
        } else {
            begin.addDays(-7)
        }

        let orders = await this.orders.where("createdAt").between(begin.getDate(), end.getDate(), true, true).reverse().sortBy("createdAt");

        let out = {
            totalOrder: orders.length,
            totalQuantity: 0,
            totalIncoming: 0,
            totalSellPrice: 0,
            totalCustomer: 0,
            totalGoods: 0,
            items: new Array<StatsItem>()
        };

        let customerSet = new Set();
        let goodsSet = new Set();

        let lastItem = {
            key: "",
            totalSellPrice: 0,
            totalIncoming: 0
        };

        for (let r of orders) {
            customerSet.add(r.customId);
            out.totalSellPrice += r.totalSellPrice;
            let goods = await this.orderGoods.where("orderId").equals(r.id).toArray();
            let purchasePrice = 0

            for (let g of goods) {
                out.totalQuantity += g.quantity;
                purchasePrice += g.purchasePrice * g.quantity;
                goodsSet.add(g.goodsId)
            }

            let incoming = r.totalSellPrice - purchasePrice - r.discount;
            out.totalIncoming += incoming;
            let f = formatDate(r.createdAt, format);

            if (lastItem.key == f) {
                lastItem.totalSellPrice += r.totalSellPrice;
                lastItem.totalIncoming += incoming;
            } else {
                lastItem = {
                    key: f,
                    totalSellPrice: r.totalSellPrice,
                    totalIncoming: incoming
                };
                out.items.push(lastItem);
            }
        }

        out.totalCustomer = customerSet.size;
        out.totalGoods = goodsSet.size;
        return out;
    }

    async exportDatas(): Promise<ExportInfo> {
        return {
            channels: await this.channels.toArray(),
            customs: await this.customers.toArray(),
            goods: await this.goods.toArray(),
            orders: await this.orders.toArray(),
            orderGoods: await this.orderGoods.toArray()
        }
    }

    convertData(d: string): Date {
        d = d.replace(/-/g, "/")
        d = d.replace(/T/g, " ")
        d = d.substring(0, d.indexOf('.'))
        return new Date(d)
    }

    async recoverDatas(ind: any) {
        for (let o of ind.channels) {
            o.createdAt = this.convertData(o.createdAt)
        }
        await this.channels.bulkPut(ind.channels);

        for (let o of ind.customs) {
            o.createdAt = this.convertData(o.createdAt)
        }
        await this.customers.bulkPut(ind.customs);

        for (let o of ind.goods) {
            o.createdAt = this.convertData(o.createdAt)
        }
        await this.goods.bulkPut(ind.goods);

        for (let o of ind.orders) {
            o.createdAt = this.convertData(o.createdAt)
        }
        await this.orders.bulkPut(ind.orders);

        await this.orderGoods.bulkPut(ind.orderGoods);
    }
}