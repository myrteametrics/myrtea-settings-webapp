import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Icons } from '../../constants/icons';
import { MultipleSelectionElement, MultipleSelectionData } from '../../models/multiple-selection';


@Component({
  selector: 'app-multiple-selection-pop-up',
  templateUrl: './multiple-selection-pop-up.component.html',
  styleUrls: ['./multiple-selection-pop-up.component.scss']
})
export class MultipleSelectionPopUpComponent implements OnInit {

  public icons = Icons;
  public selectedElements: MultipleSelectionElement[] = [];
  public searchElements: MultipleSelectionElement[] = [];

  constructor(
    public dialogRef: MatDialogRef<MultipleSelectionPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MultipleSelectionData
  ) { }

  ngOnInit() {
    this.searchElements = this.data.elements;
  }

  public search(value: string) {
    if (value.length === 0) {
      this.searchElements = this.data.elements;
      return;
    }
    this.searchElements = this.data.elements.filter((element) => {
      return element.name.includes(value);
    });
  }

  public elementIsSelected(element: MultipleSelectionElement): boolean {
    const userIndex = this.selectedElements
      .findIndex((multipleSelectionElement: MultipleSelectionElement) => element === multipleSelectionElement);
    if (userIndex === -1) {
      return false;
    }
    return true;
  }

  public selectElement(element: MultipleSelectionElement) {
    const userIndex = this.selectedElements
      .findIndex((multipleSelectionElement: MultipleSelectionElement) => element === multipleSelectionElement);
    if (userIndex === -1) {
      this.selectedElements.push(element);
    } else {
      this.selectedElements.splice(userIndex, 1);
    }
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public confirmSelection() {
    if (this.selectedElements.length === 0) {
      return;
    }
    this.dialogRef.close(this.selectedElements);
  }

}
