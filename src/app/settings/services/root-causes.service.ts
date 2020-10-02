import { Injectable } from '@angular/core';
import { ResourceService } from '../../shared/services/resource.service';
import { NetworkService } from '../../shared/services/network.service';
import { RootCause } from 'src/app/settings/interfaces/root-cause';

@Injectable({
  providedIn: 'root'
})
export class RootCausesService extends ResourceService<RootCause> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/rootcauses/',
      networkService
    );
  }
}
