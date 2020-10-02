import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerEditComponent } from './scheduler-edit.component';

describe('SchedulerEditComponent', () => {
  let component: SchedulerEditComponent;
  let fixture: ComponentFixture<SchedulerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
