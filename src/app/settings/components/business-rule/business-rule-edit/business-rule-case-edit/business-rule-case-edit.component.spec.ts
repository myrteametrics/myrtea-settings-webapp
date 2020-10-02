import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleCaseEditComponent } from './business-rule-case-edit.component';

describe('ConditionEditComponent', () => {
  let component: BusinessRuleCaseEditComponent;
  let fixture: ComponentFixture<BusinessRuleCaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleCaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleCaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
