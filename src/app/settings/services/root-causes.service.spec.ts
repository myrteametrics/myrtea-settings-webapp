import { TestBed } from '@angular/core/testing';

import { RootCausesService } from './root-causes.service';

describe('RootCausesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RootCausesService = TestBed.get(RootCausesService);
    expect(service).toBeTruthy();
  });
});
