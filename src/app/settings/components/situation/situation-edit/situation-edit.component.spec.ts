import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationEditComponent } from './situation-edit.component';

describe('SituationsEditComponent', () => {
  let component: SituationEditComponent;
  let fixture: ComponentFixture<SituationEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
