import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicPageModule } from 'ionic-angular';
import { GesturePasswordModule } from 'ngx-gesture-password';

import { MyIndexPage } from './my-index'
import { DBService } from '../../service/db.service';
import { StatsService } from '../../service/stats.service';
import { MyLockPage } from './my-lock';
import { SysDataService, reducer } from '../../service/sysdata.service';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [
        MyIndexPage,
        MyLockPage
    ],
    imports: [
        IonicPageModule.forChild(MyIndexPage),
        StoreModule.forRoot({ "state": reducer }),
        HttpClientModule,
        GesturePasswordModule
    ],
    entryComponents: [
        MyIndexPage,
        MyLockPage
    ],
    providers: [
        DBService,
        StatsService,
        SysDataService
    ]
})
export class MyModule { }