import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleActionEditComponent } from './business-rule-action-edit.component';

describe('BusinessRuleActionEditComponent', () => {
  let component: BusinessRuleActionEditComponent;
  let fixture: ComponentFixture<BusinessRuleActionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleActionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleActionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
