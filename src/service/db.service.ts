import Dexie from 'dexie'

export class DBService extends Dexie {

    constructor() {
        super("WSZB_DB2");
        this.version(1).stores({
            channels: "++id,name,&phone,intro,createdAt,updatedAt",
            customers: "++id,weixin,&phone,receiver,address,postCode,notes,createdAt,updatedAt",
            goods: "++id,channelId,name,catalog,unit,intro,sellPrice,purchasePrice,createdAt,updatedAt",
            orders: "++id,customId,totalSellPrice,discount,notes,createdAt,updatedAt",
            orderGoods: "++id,orderId,goodsId,goodsName,sellPrice,purchasePrice,quantity",
            sysDatas: "++id,key,value"
        })
    }
}

