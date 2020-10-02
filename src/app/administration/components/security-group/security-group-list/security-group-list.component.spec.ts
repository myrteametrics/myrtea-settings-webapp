import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupListComponent } from './security-group-list.component';

describe('GroupListComponent', () => {
  let component: SecurityGroupListComponent;
  let fixture: ComponentFixture<SecurityGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
