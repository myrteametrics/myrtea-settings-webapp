import { TestBed } from '@angular/core/testing';

import { LoginGuardService } from './login-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginGuardService', () => {
  // let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
    // httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    const service: LoginGuardService = TestBed.get(LoginGuardService);
    expect(service).toBeTruthy();
  });
});
