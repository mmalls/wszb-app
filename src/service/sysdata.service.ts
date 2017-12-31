import { Injectable } from '@angular/core';
import Dexie from 'dexie';

import { DBService } from './db.service';
import { Store, Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export interface SysData {
  id: number
  key: string,
  value: string
}

@Injectable()
export class SysDataService {
  table: Dexie.Table<SysData, number>;

  constructor(private dbService: DBService,
    private store: Store<AppState>) {
    this.table = this.dbService.table('sysDatas');
    this.init();
  }

  setItem(id: number, key: string, value: string) {
    this.table.put({
      id: id,
      key: key,
      value: value
    }).catch(e => {
      console.log(e);
    });
  }

  async getItem(key: string): Promise<string> {
    let ret = await this.table.where("key").equals(key).first();
    if (ret != undefined) {
      return ret.value;
    }
    return "";
  }

  setPwd(value: string) {
    this.setItem(1, "pwd", value);
  }

  async getPwd(): Promise<string> {
    return this.getItem("pwd");
  }

  setLock(value: string) {
    this.setItem(2, "lock", value);
  }

  async getLock(): Promise<string> {
    return this.getItem("lock");
  }

  async isOpenLock(): Promise<boolean> {
    return (await this.getLock()) == "true" && (await this.getPwd()) != ""
  }

  //-------------
  private async init() {
    if (await this.isOpenLock()) {
      this.openLock();
    }
  }

  getOpenLock(): Observable<boolean> {
    return  this.store.select("islock");
  }

  openLock() {
    this.store.dispatch({ type: 'OPENLOCK' });
  }

  closeLock() {
    this.store.dispatch({ type: 'CLOSELOCK' });
  }
}

//-----------------------------------
const OPENLOCK = 'OPENLOCK';
const CLOSELOCK = 'CLOSELOCK';

export interface AppState {
  islock: boolean;
}

const initAppState = {
  islock: false
}

export function reducer(state: AppState = initAppState, action: Action): AppState {
  console.log("state", state, "action", action);
  switch (action.type) {
    case OPENLOCK:
      state.islock = true;
      return state;
    case CLOSELOCK:
      state.islock = false;
      return state;
    default:
      return state;
  }
}

