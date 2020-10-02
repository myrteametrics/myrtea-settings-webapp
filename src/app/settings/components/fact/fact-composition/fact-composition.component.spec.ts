import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactCompositionComponent } from './fact-composition.component';

describe('FactCompositionComponent', () => {
  let component: FactCompositionComponent;
  let fixture: ComponentFixture<FactCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
