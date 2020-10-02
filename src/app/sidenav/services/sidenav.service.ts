import { Injectable, EventEmitter } from '@angular/core';
import { SidenavTab } from 'src/app/sidenav/models/sidenav';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  public tabs: SidenavTab[] = [];

  constructor() { }

  public addTab(newTab: SidenavTab) {
    this.tabs.push(newTab);
  }

  public clearTabs() {
    this.tabs = [];
  }
}
