import { TestBed } from '@angular/core/testing';

import { SituationService } from './situation.service';

describe('SituationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SituationService = TestBed.get(SituationService);
    expect(service).toBeTruthy();
  });
});
