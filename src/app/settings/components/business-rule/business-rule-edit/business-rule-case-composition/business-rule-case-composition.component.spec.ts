import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRulesCaseCompositionComponent } from './business-rules-case-composition.component';

describe('BusinessRulesConditionCompositionComponent', () => {
  let component: BusinessRulesCaseCompositionComponent;
  let fixture: ComponentFixture<BusinessRulesCaseCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRulesCaseCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRulesCaseCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
