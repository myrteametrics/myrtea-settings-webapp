import { EventEmitter } from '@angular/core';

export interface BubblesListingData {
  elements: BubblesListingElement[];
}

export interface BubblesListingElement {
  text: string;
  click?: EventEmitter<number>;
  id: number;
}
