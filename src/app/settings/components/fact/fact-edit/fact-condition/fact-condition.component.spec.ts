import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactConditionComponent } from './fact-condition.component';

describe('FactConditionComponent', () => {
  let component: FactConditionComponent;
  let fixture: ComponentFixture<FactConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
