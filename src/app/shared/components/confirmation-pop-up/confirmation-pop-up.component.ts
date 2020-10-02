import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface ConfirmationPopUpData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-confirmation-pop-up',
  templateUrl: './confirmation-pop-up.component.html',
  styleUrls: ['./confirmation-pop-up.component.scss']
})
export class ConfirmationPopUpComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationPopUpData
  ) { }

  ngOnInit() { }

  public closeDialog() {
    this.dialogRef.close(false);
  }

  public validate() {
    this.dialogRef.close(true);
  }

}
