import { Component, OnInit, Input } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { BubblesListingData } from 'src/app/shared/models/bubbles-listing';

@Component({
  selector: 'app-bubbles-listing',
  templateUrl: './bubbles-listing.component.html',
  styleUrls: ['./bubbles-listing.component.scss']
})
export class BubblesListingComponent implements OnInit {

  @Input() data: BubblesListingData;
  public icons = Icons;

  constructor() { }

  ngOnInit() {
  }

}
