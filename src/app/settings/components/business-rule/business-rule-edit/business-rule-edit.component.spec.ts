import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleEditComponent } from './business-rule-edit.component';

describe('BusinessRulesEditComponent', () => {
  let component: BusinessRuleEditComponent;
  let fixture: ComponentFixture<BusinessRuleEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
