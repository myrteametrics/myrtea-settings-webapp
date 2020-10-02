import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationInstanceCompositionComponent } from './situation-instance-composition.component';

describe('InstanceCompositionComponent', () => {
  let component: SituationInstanceCompositionComponent;
  let fixture: ComponentFixture<SituationInstanceCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationInstanceCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationInstanceCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
