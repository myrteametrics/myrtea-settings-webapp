import { Observable, forkJoin } from 'rxjs';
import { HeaderService } from 'src/app/header/services/header.service';
import {
  SituationInstanceCompositionComponent
} from 'src/app/settings/components/situation/situation-edit/situation-instance-composition/situation-instance-composition.component';
import { SituationDefinition, SituationParameters, SituationExpressionFact } from 'src/app/settings/interfaces/situation';
import { SituationService } from 'src/app/settings/services/situation.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Icons } from 'src/app/shared/constants/icons';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SituationBusinessRuleCompositionComponent
} from './situation-business-rule-composition/situation-business-rule-composition.component';
import {
  SecurityGroupCompositionComponent
} from 'src/app/administration/components/security-group/security-group-composition/security-group-composition.component';
import { FactDefinition } from 'src/app/settings/interfaces/fact';
import { FactCompositionComponent } from '../../fact/fact-composition/fact-composition.component';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-situation-edit',
  templateUrl: './situation-edit.component.html',
  styleUrls: ['./situation-edit.component.scss']
})
export class SituationEditComponent implements OnInit, OnDestroy {

  @ViewChild('instanceComposition', { static: false }) instanceComposition: SituationInstanceCompositionComponent;
  @ViewChild('factComposition', { static: false }) factComposition: FactCompositionComponent;
  @ViewChild('ruleComposition', { static: false }) ruleComposition: SituationBusinessRuleCompositionComponent;
  @ViewChild('groupComposition', { static: false }) groupComposition: SecurityGroupCompositionComponent;

  public icons = Icons;
  public situation: SituationDefinition;
  public creationMode: boolean;
  public formSituation = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    calendar: '',
    parameters: this.formBuilder.array([]),
    expressionFacts: this.formBuilder.array([]),
    isTemplate: [false, Validators.required],
    instances: this.formBuilder.array([])
  });
  public groupIdInSituation: number[];
  private isDirty: boolean;
  public factIdsInSituation: number[];

  public calendars: CalendarDefinition[];

  constructor(
    private headerService: HeaderService,
    private situationService: SituationService,
    private calendarService: CalendarService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.headerService.changeVisibility(false);
    this.creationMode = this.route.snapshot.data.creationMode;
    if (this.creationMode) {
      this.situation = { name: '', isTemplate: false };
      this.factIdsInSituation = [];
      this.updateForm().toPromise();
    } else {
      this.route.params.subscribe((routeParams) => {
        this.fetchSituation(routeParams.id);
      });
    }
  }

  private fetchFactIdsInSituation(situationId: number) {
    const factIds: number[] = [];
    this.situationService.listFacts(situationId).subscribe((facts: FactDefinition[]) => {
      facts.forEach((fact: FactDefinition) => {
        factIds.push(fact.id);
      });
      this.factIdsInSituation = factIds;
    });
  }

  private fetchSituation(id: number): Observable<SituationDefinition> {
    const situationRequest = this.situationService.read(id);
    situationRequest.subscribe((situation: SituationDefinition) => {
      this.situation = situation;
      this.fetchFactIdsInSituation(situation.id);
      this.formSituation.get('id').setValue(situation.id);
      this.formSituation.get('name').setValue(situation.name);
      this.formSituation.setControl('parameters', this.mapParametersToForm(situation.parameters));
      this.formSituation.setControl('expressionFacts', this.mapExpressionFactsToForm(situation.expressionFacts));
      this.formSituation.get('isTemplate').setValue(situation.isTemplate);

      this.updateForm().subscribe(() => {
        this.formSituation.get('calendar').setValue(situation.calendarId);
      });
    });
    return situationRequest;
  }

  private updateForm(): Observable<CalendarDefinition[]> {
    const calendarsObservable = this.calendarService.list();
    return calendarsObservable.pipe(mergeMap(calendars => {
      this.calendars = calendars;
      return calendarsObservable;
    }));
  }

  public saveSituation(): void {
    this.situation.name = this.formSituation.get('name').value;
    const rawCalendarId = this.formSituation.get('calendar').value;
    if (rawCalendarId !== '') {
      this.situation.calendarId = parseInt(rawCalendarId, 10);
    } else {
      delete this.situation.calendarId;
    }
    this.situation.parameters = this.extractParametersFromForm(this.formSituation.get('parameters') as FormArray);
    this.situation.expressionFacts = this.extractExpressionFactsFromForm(this.formSituation.get('expressionFacts') as FormArray);
    this.situation.isTemplate = this.formSituation.get('isTemplate').value;
    this.situation.facts = this.factComposition.getFactIds();
    this.situation.groups = this.groupComposition.getGroupsInComposition();
    this.creationMode ? this.createSituation() : this.updateSituation();
  }

  private updateSituation() {
    const ruleIds = this.ruleComposition.getRuleIds();
    const requests = [
      this.situationService.update(this.situation.id, this.situation),
      this.situationService.setRules(this.situation.id, ruleIds)
    ];
    if (this.formSituation.value.isTemplate) {
      const instances = this.instanceComposition.getInstances();
      requests.push(this.situationService.setInstances(this.situation.id, instances));
    }
    forkJoin(requests).subscribe(() => {
      const message = 'MISSING';
      this.snackBar.open(message, null, { duration: 2000 });
      this.formSituation.markAsPristine();
      this.isDirty = false;
    },
      (err) => {
        // TODO: error catch ( => snackbar error)
      });
  }

  private createSituation() {
    const ruleIds = this.ruleComposition.getRuleIds();
    this.situationService.create(this.situation).subscribe((createdSituation: SituationDefinition) => {
      const requests = [
        this.situationService.setRules(createdSituation.id, ruleIds)
      ];
      if (this.formSituation.value.isTemplate) {
        const instances = this.instanceComposition.getInstances();
        requests.push(this.situationService.setInstances(createdSituation.id, instances));
      }
      forkJoin(requests).subscribe(() => {
        const message = 'MISSING';
        this.snackBar.open(message, null, { duration: 2000 });
        this.return();
      },
        (err) => {
          // TODO: error catch ( => snackbar error)
        });
    });
  }

  public return(): void {
    this.router.navigate(['/settings/situations']);
  }

  public cancel(): void {
    if (this.creationMode) {
      this.return();
    } else {
      this.fetchSituation(this.situation.id).subscribe(() => {
        if (this.situation.isTemplate) {
          this.instanceComposition.fetchInstancesInSituation();
        }
        this.groupComposition.reset();
        this.factComposition.reset();
        this.ruleComposition.fetchRulesInSituation();
      });
      this.formSituation.markAsPristine();
      this.isDirty = false;
    }
  }

  public deleteSituation(): void {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.situation.component.deletewindow.title',
        content: 'settings.situation.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.situationService.delete(this.situation.id).subscribe(() => {
          const message = 'MISSING';
          this.snackBar.open(message, null, { duration: 2000 });
          this.return();
        },
          (err) => {
            // TODO: error catch ( => snackbar error)
          });
      }
    });
  }

  public deleteParameter(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.formSituation.markAsDirty();
  }

  public addNewParameter(fieldForm: FormGroup): void {
    const parameters = fieldForm.get('parameters') as FormArray;
    parameters.push(
      this.formBuilder.group({
        key: this.formBuilder.control(''),
        value: this.formBuilder.control('')
      })
    );
    this.formSituation.markAsDirty();
  }

  public deleteExpressionFact(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.formSituation.markAsDirty();
  }

  public addNewExpressionFact(fieldForm: FormGroup): void {
    const parameters = fieldForm.get('expressionFacts') as FormArray;
    parameters.push(
      this.formBuilder.group({
        key: this.formBuilder.control(''),
        value: this.formBuilder.control('')
      })
    );
    this.formSituation.markAsDirty();
  }

  public situationIsModifiedAndReady(): boolean {
    return (this.formSituation.dirty || this.isDirty) && this.formSituation.valid;
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

  private mapParametersToForm(parameters: SituationParameters): FormArray {
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

  private extractParametersFromForm(formArray: FormArray): SituationParameters {
    const parameters = {};
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      const value = control.get('value').value;
      parameters[key] = value;
    }
    return parameters;
  }

  private mapExpressionFactsToForm(expressionFacts: SituationExpressionFact[]): FormArray {
    const parametersForm = this.formBuilder.array([]);
    if (expressionFacts) {
      for (const entry of expressionFacts) {
        parametersForm.push(
          this.formBuilder.group({
            name: this.formBuilder.control(entry.name),
            expression: this.formBuilder.control(entry.expression)
          })
        );
      }
    }
    return parametersForm;
  }

  private extractExpressionFactsFromForm(formArray: FormArray): SituationExpressionFact[] {
    const parameters = [];
    for (const control of formArray.controls) {
      const name = (control.get('name').value as string).trim();
      const expression = control.get('expression').value;
      parameters.push({name, expression});
    }
    return parameters;
  }
}
