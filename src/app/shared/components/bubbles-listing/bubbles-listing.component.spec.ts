import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubblesListingComponent } from './bubbles-listing.component';

describe('BubblesListingComponent', () => {
  let component: BubblesListingComponent;
  let fixture: ComponentFixture<BubblesListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubblesListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubblesListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
