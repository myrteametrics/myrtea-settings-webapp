import { Injectable } from '@angular/core';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { ResourceService } from '@shared/services/resource.service';
import { NetworkService } from '@shared/services/network.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends ResourceService<CalendarDefinition> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/calendars',
      networkService
    );
  }

}
