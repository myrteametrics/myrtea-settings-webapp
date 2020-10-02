import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationBusinessRuleCompositionComponent } from './situation-business-rule-composition.component';

describe('SituationBusinessRuleCompositionComponent', () => {
  let component: SituationBusinessRuleCompositionComponent;
  let fixture: ComponentFixture<SituationBusinessRuleCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationBusinessRuleCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationBusinessRuleCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
