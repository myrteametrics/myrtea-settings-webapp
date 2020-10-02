import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityGroupEditComponent } from './security-group-edit.component';

describe('GroupEditionComponent', () => {
  let component: SecurityGroupEditComponent;
  let fixture: ComponentFixture<SecurityGroupEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityGroupEditComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
