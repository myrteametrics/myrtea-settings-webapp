import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleSelectionPopUpComponent } from './multiple-selection-pop-up.component';

describe('MultipleSelectionPopUpComponent', () => {
  let component: MultipleSelectionPopUpComponent;
  let fixture: ComponentFixture<MultipleSelectionPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleSelectionPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleSelectionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
