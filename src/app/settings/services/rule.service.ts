import { Injectable } from '@angular/core';
import { ResourceService } from '../../shared/services/resource.service';
import { NetworkService } from '../../shared/services/network.service';
import { Rule } from '../interfaces/rule';

@Injectable({
  providedIn: 'root'
})
export class RuleService extends ResourceService<Rule> {

  constructor(
    public networkSerive: NetworkService
  ) {
    super(
      '/engine/rules',
      networkSerive
    );
  }

  public getSituationsInRule(ruleId: number) {
    return this.networkSerive.get(`${this.endpoint}/${ruleId}/situations`);
  }

  public setSituationsForRule(ruleId: number, situationsId: number[]) {
    return this.networkSerive.post(`${this.endpoint}/${ruleId}/situations`, situationsId);
  }
}
