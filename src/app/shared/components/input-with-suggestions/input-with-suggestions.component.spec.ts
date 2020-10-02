import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWithSuggestionsComponent } from './input-with-suggestions.component';

describe('InputWithSuggestionsComponent', () => {
  let component: InputWithSuggestionsComponent;
  let fixture: ComponentFixture<InputWithSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputWithSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWithSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
