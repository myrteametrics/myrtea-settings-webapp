import { TestBed } from '@angular/core/testing';

import { InternalRoutingService } from './internal-routing.service';

describe('InternalRoutingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InternalRoutingService = TestBed.get(InternalRoutingService);
    expect(service).toBeTruthy();
  });
});
