import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor() {
  }

  goBack() {
    if (localStorage.getItem('myrtea') !== null) {
      const myrteaStorage = JSON.parse(localStorage.getItem('myrtea'));
      delete myrteaStorage[Object.keys(myrteaStorage).length - 1];
      localStorage.setItem('myrtea', JSON.stringify(myrteaStorage));
    }
  }
}
