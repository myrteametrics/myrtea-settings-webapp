import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsControlBarComponent } from './settings-control-bar.component';

describe('SettingsControlBarComponent', () => {
  let component: SettingsControlBarComponent;
  let fixture: ComponentFixture<SettingsControlBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsControlBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsControlBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
