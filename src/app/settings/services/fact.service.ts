import { Injectable } from '@angular/core';
import { ResourceService } from '@shared/services/resource.service';
import { NetworkService } from '@shared/services/network.service';
import { FactDefinition } from '../interfaces/fact';
import { Observable } from 'rxjs';
import { Router, UrlSerializer } from '@angular/router';
import { FactSearch, FactHits } from '../interfaces/fact-search';

@Injectable({
  providedIn: 'root'
})
export class FactService extends ResourceService<FactDefinition> {

  constructor(
    public networkService: NetworkService,
    private router: Router,
    private serializer: UrlSerializer
  ) {
    super(
      '/engine/facts',
      networkService
    );
  }

  public hits(factId: number, factSearch: FactSearch): Observable<FactHits> {
    const tree = this.router.createUrlTree([`${this.endpoint}/${factId}/hits`], { queryParams: factSearch });
    return this.networkService.get(this.serializer.serialize(tree));
  }

  public test(
    fact: FactDefinition, time: string, nhit: number,
    offset: number, placeholders: string, debug: string
  ): Observable<FactDefinition> {
    let queryParams: {} = { time };
    if (nhit) {
      queryParams = { ...queryParams, nhit };
    }
    if (offset) {
      queryParams = { ...queryParams, offset };
    }
    if (placeholders) {
      queryParams = { ...queryParams, placeholders };
    }
    if (debug) {
      queryParams = { ...queryParams, debug };
    }
    const tree = this.router.createUrlTree([`${this.endpoint}/execute`], { queryParams });
    return this.networkService.post(this.serializer.serialize(tree), fact) as Observable<FactDefinition>;
  }

  public listBaselines(id: number) {
    return this.networkService.get(`${this.endpoint}/${id}/baselines`);
  }

}
