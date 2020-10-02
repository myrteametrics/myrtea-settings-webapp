import { Component, OnInit, Inject } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ACTIONS_TYPE, ActionType } from '@shared/models/action';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { Action } from 'src/app/settings/interfaces/rule';
import { BusinessRuleEditService } from '../../business-rule-edit.service';

interface ActionEditData {
  creationMode: boolean;
  action?: Action;
  actionIndex?: number;
}

@Component({
  selector: 'app-business-rule-action-edit',
  templateUrl: './business-rule-action-edit.component.html',
  styleUrls: ['./business-rule-action-edit.component.scss']
})
export class BusinessRuleActionEditComponent implements OnInit {

  public icons = Icons;
  public ACTIONS_TYPE = ACTIONS_TYPE;
  public creationMode: boolean;
  public actionForm: FormGroup;
  public parametersForm: FormGroup = this.formBuilder.group({
    parameters: this.formBuilder.array([])
  });

  constructor(
    public dialogRef: MatDialogRef<BusinessRuleActionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ActionEditData,
    private formBuilder: FormBuilder,
    private businessRuleEditService: BusinessRuleEditService,
  ) { }

  ngOnInit() {
    this.creationMode = this.data.creationMode ? true : false;
    if (!this.creationMode) {
      this.initForEditionMode();
    } else {
      this.actionForm = this.formBuilder.group({
        name: ['', Validators.required]
      });
    }
    this.actionForm.get('name').valueChanges.subscribe((actionName: string) => this.setParametersForm(actionName));
  }

  private initForEditionMode() {
    const actionName = this.data.action.name.replace(/"/g, '');
    this.actionForm = this.formBuilder.group({
      name: [actionName, Validators.required]
    });
    this.actionForm.get('name').disable();
    this.setParametersForm(actionName, this.data.action);
  }

  public confirm() {
    const action: Action = {
      name: `"${this.actionForm.get('name').value}"`,
      parameters: this.extractParametersFromForm(this.parametersForm.get('parameters') as FormArray)
    };
    if (this.creationMode) {
      this.businessRuleEditService.addAction(action);
    } else {
      this.businessRuleEditService.modifyAction(action, this.data.actionIndex);
    }
    this.dialogRef.close();
  }

  private extractParametersFromForm(formArray: FormArray) {
    // const parameters = [];
    // for (const control of formArray.controls) {
    //   const key = (control.get('key').value as string).trim();
    //   const value = control.get('value').value;
    //   parameters.push({ [key]: value });
    // }
    // return parameters;

    const parameters = {};
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      const value = control.get('value').value;
      parameters[key] = value;
    }
    return parameters;
  }

  public formIsValid(): boolean {
    return this.actionForm.valid && this.parametersForm.dirty;
  }

  private setParametersForm(actionName: string, actionInstance?: Action) {
    if (actionName === '') { return; }
    this.resetParametersForm();
    const keys: string[] = (actionName === 'set' && actionInstance !== undefined) ?
      Object.keys(actionInstance.parameters) :
      ACTIONS_TYPE.find((action: ActionType) => action.name === actionName).keys;
    keys.forEach((key: string) => {
      this.addNewParameter(
        this.parametersForm,
        actionName !== 'set',
        key,
        (actionInstance !== undefined) ? actionInstance.parameters[key.replace(/"/g, '')] : ''
      );
    });
  }

  private resetParametersForm() {
    this.parametersForm = this.formBuilder.group({
      parameters: this.formBuilder.array([])
    });
  }

  public deleteParameter(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.parametersForm.markAsDirty();
  }

  public addNewParameter(fieldForm: FormGroup, disableKey: boolean = false, key: string = '', value: string = ''): void {
    const parameters = fieldForm.get('parameters') as FormArray;
    const control: AbstractControl = this.formBuilder.group({
      key: this.formBuilder.control(key),
      value: this.formBuilder.control(value)
    });
    if (disableKey) {
      control.get('key').disable();
    }
    parameters.push(control);
    this.parametersForm.markAsDirty();
  }

}
