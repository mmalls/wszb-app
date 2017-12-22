import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';


import { StatsInfo, StatsItem, StatsService } from '../../service/stats.service'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @Input() queryBy: string = "week";

  @Input() previews: Array<PreviewData>;

  @Input() statsInfo: StatsInfo;

  @Input() items: Array<StatsItem>;

  constructor(public navCtrl: NavController,
    public statsService: StatsService) {

  }

  ionViewWillEnter() {
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
    });
  }

  listOrder(key: string) {

  }

}

export interface PreviewData {
  value: string,
  desc: string
}
