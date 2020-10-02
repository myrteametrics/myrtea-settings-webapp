import { TestBed } from '@angular/core/testing';

import { SecurityGroupService } from './security-group.service';

describe('GroupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SecurityGroupService = TestBed.get(SecurityGroupService);
    expect(service).toBeTruthy();
  });
});
