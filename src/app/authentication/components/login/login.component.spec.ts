import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { LoginComponent } from './login.component';
import { MaterialModule } from 'src/app/shared/modules/material/material.module';


const translations: {} = {};

export class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    return of(translations);
  }
}

describe('LoginComponent', () => {
  let translate: TranslateService;
  let injector: Injector;
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  // let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MaterialModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
        HttpClientTestingModule,
        RouterTestingModule
      ]
    })
      .compileComponents();
    injector = getTestBed();
    translate = injector.get(TranslateService);
    translate.use('fr');
    // httpMock = TestBed.get(HttpTestingController);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
