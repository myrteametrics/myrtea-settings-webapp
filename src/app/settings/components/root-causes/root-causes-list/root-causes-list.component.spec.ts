import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RootCausesListComponent } from './root-causes-list.component';

describe('RootCausesListComponent', () => {
  let component: RootCausesListComponent;
  let fixture: ComponentFixture<RootCausesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RootCausesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RootCausesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
