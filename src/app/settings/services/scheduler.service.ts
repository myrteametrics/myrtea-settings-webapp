import { Injectable } from '@angular/core';
import { NetworkService } from '../../shared/services/network.service';
import { ResourceService } from '../../shared/services/resource.service';
import { SchedulerJob } from '../interfaces/scheduler';

@Injectable({
  providedIn: 'root'
})
export class SchedulerService extends ResourceService<SchedulerJob> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/scheduler/jobs/',
      networkService
    );
  }
}
