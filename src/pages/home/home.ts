import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { StatsInfo, StatsItem, StatsService } from '../../service/stats.service'
import { OrderIndexPage } from '../order/order-index';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage  {

  @Input() queryBy: string = "week";

  @Input() previews: Array<PreviewData>;

  @Input() statsInfo: StatsInfo;

  @Input() items: Array<StatsItem>;

  public barChartLabels: string[] = [];

  public barChartData: any[] = [
    { data: [], label: '利润' },
    { data: [], label: '销售额' },
  ];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  constructor(public navCtrl: NavController,
    public statsService: StatsService) {
  }

  ionViewWillEnter() {
    //this.listStats(this.queryBy);
  }

  ionViewDidEnter() {
    this.listStats(this.queryBy);
  }

  segmentChanged() {
    this.listStats(this.queryBy);
  }

  listStats(by: string) {
    let avgDesc = "日";
    if (by == "year") {
      avgDesc = "月";
    }

    this.statsService.queryOrderStats(by).then(d => {
      this.statsInfo = d;
      this.items = d.items;
      let count = d.items.length;
      if (count == 0) {
        count = 1;
      }

      this.previews = [
        { value: '' + d.totalOrder, desc: "总成交单数" },
        { value: "￥" + d.totalSellPrice.toFixed(2), desc: "总销售额" },
        {
          value: "￥" + (d.totalSellPrice / count).toFixed(2),
          desc: "平均" + avgDesc + "销售额"
        },
        { value: '' + d.totalCustomer, desc: "总成交客户数" },
        { value: "￥" + d.totalIncoming.toFixed(2), desc: "总利润" },
        {
          value: "￥" + (d.totalIncoming / count).toFixed(2),
          desc: "平均" + avgDesc + "利润"
        }
      ];

      let labels=[];
      let d1=[];
      let d2=[];
      for (let it of this.items) {
        labels.push(it.key);
        d1.push(it.totalIncoming);
        d2.push(it.totalSellPrice);
      }
      this.barChartLabels= labels;
      this.barChartData = [
        { data: d1, label: '利润' },
        { data: d2, label: '销售额' },
      ];
    });
  }

  listOrder(key: string) {
    if (this.queryBy == 'year') {
      this.navCtrl.push(OrderIndexPage, { 'month': key });
    } else {
      this.navCtrl.push(OrderIndexPage, { 'day': key });
    }
  }

}

export interface PreviewData {
  value: string,
  desc: string
}
