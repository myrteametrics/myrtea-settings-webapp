import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessRuleSituationCompositionComponent } from './business-rule-situation-composition.component';

describe('BusinessRuleSituationCompositionComponent', () => {
  let component: BusinessRuleSituationCompositionComponent;
  let fixture: ComponentFixture<BusinessRuleSituationCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessRuleSituationCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessRuleSituationCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
