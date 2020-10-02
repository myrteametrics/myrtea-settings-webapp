import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRulesListComponent } from './business-rules-list.component';

describe('BusinessRulesListComponent', () => {
  let component: BusinessRulesListComponent;
  let fixture: ComponentFixture<BusinessRulesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRulesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRulesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
