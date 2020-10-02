import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactTestComponent } from './fact-test.component';

describe('FactTestComponent', () => {
  let component: FactTestComponent;
  let fixture: ComponentFixture<FactTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
