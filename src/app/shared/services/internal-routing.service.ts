import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InternalRoutingService {

  public loginPage = '/login';
  public settingsPage = '/settings';
  public forbiddenPage = '/forbidden';

  constructor() { }
}
