import { Injectable } from '@angular/core';
import { BaselineDefinition } from 'src/app/settings/interfaces/baseline';
import { ResourceService } from 'src/app/shared/services/resource.service';
import { NetworkService } from 'src/app/shared/services/network.service';

@Injectable({
  providedIn: 'root'
})
export class BaselineService extends ResourceService<BaselineDefinition> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/baselines',
      networkService
    );
  }

}
