import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicPageModule } from 'ionic-angular';

import { MyIndexPage } from './my-index'
import { DBService } from '../../service/db.service';
import { StatsService } from '../../service/stats.service';

@NgModule({
    declarations: [
        MyIndexPage,
    ],
    imports: [
        IonicPageModule.forChild(MyIndexPage),
        HttpClientModule
    ],
    entryComponents: [
        MyIndexPage
    ],
    providers: [
        DBService,
        StatsService
    ]
})
export class MyModule { }