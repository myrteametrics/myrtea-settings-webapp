import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Icons } from 'src/app/shared/constants/icons';
import { Validators, FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { SituationInstanceDefinition, SituationParameters, SituationInstanceEditData } from 'src/app/settings/interfaces/situation';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';

@Component({
  selector: 'app-situation-instance-edit',
  templateUrl: './situation-instance-edit.component.html',
  styleUrls: ['./situation-instance-edit.component.scss']
})
export class SituationInstanceEditComponent implements OnInit {

  public icons = Icons;
  public creationMode: boolean;
  public wasValidated: boolean;

  public calendars: CalendarDefinition[];

  public instanceEditForm: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    calendar: '',
    parameters: this.formBuilder.array([]),
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<SituationInstanceEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SituationInstanceEditData
  ) { }

  ngOnInit() {
    this.creationMode = this.data.creationMode;
    this.convertDataToForm(this.data.instance, this.data.calendars);
  }

  private convertDataToForm(instance: SituationInstanceDefinition, calendars: CalendarDefinition[]) {
    this.calendars = calendars;
    this.instanceEditForm.get('id').setValue(instance.id);
    this.instanceEditForm.get('name').setValue(instance.name);
    this.instanceEditForm.setControl('parameters', this.mapParametersToForm(instance.parameters));
    this.instanceEditForm.get('calendar').setValue(instance.calendarId);
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public confirmSelection() {
    if (this.instanceEditForm.invalid) {
      this.wasValidated = true;
      return;
    }

    const instance: SituationInstanceDefinition = {
      id: this.instanceEditForm.get('id').value,
      name: this.instanceEditForm.get('name').value,
      parameters: this.extractParametersFromForm(this.instanceEditForm.get('parameters') as FormArray)
    };

    const rawCalendarId = this.instanceEditForm.get('calendar').value;
    if (rawCalendarId !== '') {
      instance.calendarId = parseInt(rawCalendarId, 10);
    }
    this.dialogRef.close(instance);
  }

  public deleteParameter(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.instanceEditForm.markAsDirty();
  }

  public addNewParameter(fieldForm: FormGroup): void {
    const parameters = fieldForm.get('parameters') as FormArray;
    parameters.push(
      this.formBuilder.group({
        key: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
    this.instanceEditForm.markAsDirty();
  }

  private mapParametersToForm(parameters: SituationParameters): FormArray {
    const parametersForm = this.formBuilder.array([]);
    if (parameters) {
      for (const entry of Object.entries(parameters)) {
        parametersForm.push(
          this.formBuilder.group({
            key: [entry[0], Validators.required],
            value: [entry[1], Validators.required],
          })
        );
      }
    }
    return parametersForm;
  }

  private extractParametersFromForm(formArray: FormArray): SituationParameters {
    const parameters = {};
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      const value = control.get('value').value;
      parameters[key] = value;
    }
    return parameters;
  }
}
