import { TestBed } from '@angular/core/testing';

import { BusinessRuleEditService } from './business-rule-edit.service';

describe('BusinessRuleEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessRuleEditService = TestBed.get(BusinessRuleEditService);
    expect(service).toBeTruthy();
  });
});
