import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { RuleService } from 'src/app/settings/services/rule.service';
import { Rule, RuleParameters } from 'src/app/settings/interfaces/rule';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { Icons } from 'src/app/shared/constants/icons';
import { BusinessRuleState } from 'src/app/settings/interfaces/states/business-rule-state';
import { BusinessRuleEditService } from 'src/app/settings/components/business-rule/business-rule-edit/business-rule-edit.service';
import { BusinessRuleCaseEditComponent } from './business-rule-case-edit/business-rule-case-edit.component';
import {
  BusinessRuleSituationCompositionComponent
} from './business-rule-situation-composition/business-rule-situation-composition.component';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-business-rule-edit',
  templateUrl: './business-rule-edit.component.html',
  styleUrls: ['./business-rule-edit.component.scss'],
})
export class BusinessRuleEditComponent implements OnInit, OnDestroy {

  @ViewChild('caseEdit', { static: false }) caseEdit: BusinessRuleCaseEditComponent;
  @ViewChild('situationComposition', { static: false }) situationComposition: BusinessRuleSituationCompositionComponent;
  public businessRuleState = BusinessRuleState;
  public icons = Icons;
  public creationMode: boolean;
  public ruleForm = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    description: ['', Validators.required],
    calendar: '',
    status: [true, Validators.required],
    parameters: this.formBuilder.array([])
  });
  private isDirty: boolean;

  public calendars: CalendarDefinition[];

  constructor(
    private headerService: HeaderService,
    private ruleService: RuleService,
    private calendarService: CalendarService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public businessRuleEditService: BusinessRuleEditService
  ) { }

  ngOnInit() {
    this.headerService.changeVisibility(false);
    this.creationMode = this.route.snapshot.data.creationMode;
    if (this.creationMode) {
      this.businessRuleEditService.setCreationModeTrue();
      this.updateForm().toPromise();
    } else {
      this.route.params.subscribe((params) => {
        this.fetchCurrentRule(params.id);
      });
    }
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

  public save() {
    if (this.businessRuleEditService.currentState === BusinessRuleState.EDITION) {
      const rule: Rule = {
        ... this.businessRuleEditService.currentRule,
        name: this.ruleForm.value.name,
        description: this.ruleForm.value.description,
        enabled: this.ruleForm.value.status
      };
      const rawCalendarId = this.ruleForm.get('calendar').value;
      if (rawCalendarId !== '') {
        rule.calendarId = parseInt(rawCalendarId, 10);
      }
      rule.parameters = this.extractParametersFromForm(this.ruleForm.get('parameters') as FormArray);
      const situationsId = this.situationComposition.getSituationsId();
      this.route.snapshot.data.creationMode ? this.createRule(rule, situationsId) : this.modifyRule(rule, situationsId);
      return;
    }
    this.caseEdit.save();
  }

  public cancel() {
    if (this.businessRuleEditService.currentState === BusinessRuleState.EDITION) {
      this.situationComposition.resetSitutations();
      this.fetchCurrentRule(this.businessRuleEditService.currentRule.id);
      this.isDirty = false;
      this.ruleForm.markAsPristine();
    } else {
      this.caseEdit.cancel();
    }
  }

  public formIsValid(): boolean {
    if (this.businessRuleEditService.currentState === BusinessRuleState.EDITION) {
      const numberOfCase = this.businessRuleEditService.currentRule.cases.length;
      return (this.ruleForm.dirty || this.isDirty) && this.ruleForm.valid && (numberOfCase > 0);
    } else {
      return !!this.caseEdit && this.caseEdit.formIsValid();
    }
  }

  public deleteParameter(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.ruleForm.markAsDirty();
  }

  public addNewParameter(fieldForm: FormGroup): void {
    const parameters = fieldForm.get('parameters') as FormArray;
    parameters.push(
      this.formBuilder.group({
        key: this.formBuilder.control(''),
        value: this.formBuilder.control('')
      })
    );
    this.ruleForm.markAsDirty();
  }

  private updateForm(): Observable<CalendarDefinition[]> {
    const calendarsObservable = this.calendarService.list();
    return calendarsObservable.pipe(mergeMap(calendars => {
      this.calendars = calendars;
      return calendarsObservable;
    }));
  }

  private fetchCurrentRule(ruleId: number) {
    this.ruleService.read(ruleId).subscribe((rule: Rule) => {
      this.businessRuleEditService.setCurrentRule(rule);
      this.ruleForm.get('id').setValue(rule.id);
      this.ruleForm.get('name').setValue(rule.name);
      this.ruleForm.get('description').setValue(rule.description);
      this.ruleForm.get('status').setValue(rule.enabled);
      this.ruleForm.setControl('parameters', this.mapParametersToForm(rule.parameters));
      this.updateForm().subscribe(() => {
        this.ruleForm.get('calendar').setValue(rule.calendarId);
      });
      this.isDirty = false;
    });
  }

  private createRule(ruleToCreate: Rule, situationsId: number[]) {
    this.ruleService.create(ruleToCreate).subscribe((ruleCreated: Rule) => {
      this.ruleService.setSituationsForRule(ruleCreated.id, situationsId).toPromise();
      this.businessRuleEditService.return();
    });
  }

  private modifyRule(ruleToSave: Rule, situationsId: number[]) {
    this.ruleService.setSituationsForRule(ruleToSave.id, situationsId).toPromise();
    this.ruleService.update(ruleToSave.id, ruleToSave).subscribe(() => {
      this.businessRuleEditService.return();
    });
  }

  private mapParametersToForm(parameters: RuleParameters): FormArray {
    const parametersForm = this.formBuilder.array([]);
    if (parameters) {
      for (const entry of Object.entries(parameters)) {
        parametersForm.push(
          this.formBuilder.group({
            key: this.formBuilder.control(entry[0]),
            value: this.formBuilder.control(entry[1])
          })
        );
      }
    }
    return parametersForm;
  }

  private extractParametersFromForm(formArray: FormArray): RuleParameters {
    const parameters = {};
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      const value = control.get('value').value;
      parameters[key] = value;
    }
    return parameters;
  }

}
