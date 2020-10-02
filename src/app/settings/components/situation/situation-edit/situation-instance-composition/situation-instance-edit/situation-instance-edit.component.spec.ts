import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceEditComponent } from './instance-edit.component';

describe('InstanceEditComponent', () => {
  let component: InstanceEditComponent;
  let fixture: ComponentFixture<InstanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
