import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FactDefinition } from 'src/app/settings/interfaces/fact';
import { Icons } from 'src/app/shared/constants/icons';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-fact-test',
  templateUrl: './fact-test.component.html',
  styleUrls: ['./fact-test.component.scss']
})
export class FactTestComponent implements OnInit {
  public icons = Icons;
  public testForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<FactTestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      fact: FactDefinition,
      testFields: {
        timestamp: string,
        hits: string,
        offset: string,
        placeholders: string
      }
    }
  ) { }

  ngOnInit() {
    this.testForm = this.fb.group({
      timestamp: '',
      hits: '',
      offset: '',
      placeholders: '',
    });
  }

  public closeDialog() {
    this.dialogRef.close(false);
  }

  public validate() {
    this.data.testFields = this.testForm.value;
    this.dialogRef.close(this.data);
  }

}
