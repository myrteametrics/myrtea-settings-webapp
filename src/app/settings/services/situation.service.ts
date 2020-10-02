import { Injectable } from '@angular/core';
import { NetworkService } from '../../shared/services/network.service';
import { ResourceService } from '../../shared/services/resource.service';
import { SituationDefinition, SituationInstanceDefinition } from '../interfaces/situation';
import { Observable } from 'rxjs';
import { Rule } from '../interfaces/rule';
import { FactDefinition } from 'src/app/settings/interfaces/fact';

@Injectable({
  providedIn: 'root'
})
export class SituationService extends ResourceService<SituationDefinition> {

  constructor(
    public networkService: NetworkService
  ) {
    super(
      '/engine/situations',
      networkService
    );
  }

  public listFacts(id: number): Observable<FactDefinition[]> {
    return this.networkService.get(`${this.endpoint}/${id}/facts`);
  }

  public listRules(id: number): Observable<Rule[]> {
    return this.networkService.get(`${this.endpoint}/${id}/rules`);
  }

  public setRules(situationId: number, ruleIDs: number[]): Observable<any> {
    return this.networkService.put(`${this.endpoint}/${situationId}/rules`, ruleIDs);
  }

  public listInstances(id: number): Observable<SituationInstanceDefinition[]> {
    return this.networkService.get(`${this.endpoint}/${id}/instances`);
  }

  public setInstances(id: number, instances: SituationInstanceDefinition[]): Observable<any> {
    return this.networkService.put(`${this.endpoint}/${id}/instances`, instances);
  }

}
