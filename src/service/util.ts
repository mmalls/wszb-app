
export class DateExt  {

    private now = new Date();

    constructor() {
        
    }

    addDays(d: number): Date {
        this.now.setDate(this.now.getDate() + d);
        return this.now;
    }

    addWeeks(w: number): Date {
        return this.addDays(w * 7);
    }

    addMonths(m: number): Date {
        var d = this.now.getDate();
        this.now.setMonth(this.now.getMonth() + m);
        if (this.now.getDate() < d) {
            this.now.setDate(0);
        }

        return this.now;
    }

    addYears(y: number): Date {
        //console.log('addYears', y)  
        var m = this.now.getMonth();
        this.now.setFullYear(this.now.getFullYear() + y);
        if (m < this.now.getMonth()) {
            this.now.setDate(0);
        }

        return this.now;
    }
}

//js格式化时间 "yyyy-MM-dd hh:mm:ss" 
export function formatData(d: Date, fmt: string): string {
    let o = {
        "M+": d.getMonth() + 1, //月份  
        "d+": d.getDate(), //日  
        "h+": d.getHours(), //小时  
        "m+": d.getMinutes(), //分  
        "s+": d.getSeconds(), //秒  
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度  
        "S": d.getMilliseconds() //毫秒  
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}

export function uuid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

