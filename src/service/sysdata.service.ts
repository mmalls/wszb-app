
import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';


export interface SysData {
  id: number
  key: string,
  value: string
}

@Injectable()
export class SysDataService {
  table: Dexie.Table<SysData, number>;

  constructor(private dbService: DBService) {
    this.table = this.dbService.table('sysDatas');
  }
}

