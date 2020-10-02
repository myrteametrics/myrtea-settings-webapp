import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCompositionComponent } from './calendar-composition.component';

describe('CalendarCompositionComponent', () => {
  let component: CalendarCompositionComponent;
  let fixture: ComponentFixture<CalendarCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
