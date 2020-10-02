import { TestBed } from '@angular/core/testing';

import { FactEditService } from './fact-edit.service';
import { FormBuilder } from '@angular/forms';

describe('FactEditService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      FormBuilder
    ],
  }));

  it('should be created', () => {
    const service: FactEditService = TestBed.get(FactEditService);
    expect(service).toBeTruthy();
  });
});
