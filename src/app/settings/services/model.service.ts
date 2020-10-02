import { Injectable } from '@angular/core';
import { ResourceService } from '../../shared/services/resource.service';
import { NetworkService } from '../../shared/services/network.service';
import { ModelDefinition } from '../interfaces/model';

@Injectable({
  providedIn: 'root'
})
export class ModelService extends ResourceService<ModelDefinition> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/models',
      networkService
    );
  }
}
