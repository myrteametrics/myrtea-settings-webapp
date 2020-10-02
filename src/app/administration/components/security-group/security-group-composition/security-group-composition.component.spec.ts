import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupCompositionComponent } from './security-group-composition.component';

describe('SecurityGroupCompositionComponent', () => {
  let component: SecurityGroupCompositionComponent;
  let fixture: ComponentFixture<SecurityGroupCompositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityGroupCompositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityGroupCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
