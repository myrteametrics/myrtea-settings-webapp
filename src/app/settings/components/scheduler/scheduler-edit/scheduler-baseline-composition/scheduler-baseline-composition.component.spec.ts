import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerBaselineCompositionComponent } from './scheduler-baseline-composition.component';

describe('SchedulerBaselineCompositionComponent', () => {
  let component: SchedulerBaselineCompositionComponent;
  let fixture: ComponentFixture<SchedulerBaselineCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerBaselineCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerBaselineCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
