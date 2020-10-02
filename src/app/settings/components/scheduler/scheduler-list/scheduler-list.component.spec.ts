import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerListComponent } from './scheduler-list.component';

describe('SchedulersListComponent', () => {
  let component: SchedulerListComponent;
  let fixture: ComponentFixture<SchedulerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
