import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public titleEmitter = new EventEmitter<string>();
  public hiddeEmitter = new EventEmitter<boolean>();

  public changeTitle(value: string) {
    this.titleEmitter.emit(value);
  }

  public changeVisibility(visible: boolean) {
    this.hiddeEmitter.emit(visible);
  }

}
