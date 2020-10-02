import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituationListComponent } from './situation-list.component';

describe('SituationsListComponent', () => {
  let component: SituationListComponent;
  let fixture: ComponentFixture<SituationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
