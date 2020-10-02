import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HeaderService } from 'src/app/header/services/header.service';
import { FactEditService } from 'src/app/settings/components/fact/fact-edit/fact-edit.service';
import {
  FactDefinition, FactDimension, FactDimensionOperator, FactDimensionOptions, FactIntentOperator
} from 'src/app/settings/interfaces/fact';
import { flattenModelFields, ModelDefinition, ModelField, ModelFieldType, Models } from 'src/app/settings/interfaces/model';
import { FactService } from 'src/app/settings/services/fact.service';
import { ModelService } from 'src/app/settings/services/model.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Icons } from 'src/app/shared/constants/icons';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fact-edit',
  templateUrl: './fact-edit.component.html',
  styleUrls: ['./fact-edit.component.scss']
})
export class FactEditComponent implements OnInit, OnDestroy {

  public icons = Icons;
  public factTranslation: any;

  public models: ModelDefinition[];
  public modelTerms: ModelField[];
  public factIntentOperator: string[] = Object.values(FactIntentOperator).filter(value => typeof value === 'string') as string[];
  public factDimensionOperator: string[] = Object.values(FactDimensionOperator).filter(value => typeof value === 'string') as string[];

  public creationMode: boolean;
  public factName: string;
  public wasValidated = false;
  public factId: number;
  public factEditForm: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required && Validators.minLength(3)],
    model: ['', Validators.required],
    calculationDepth: ['', Validators.required],
    intent: this.formBuilder.group({
      name: [{ value: null, disabled: true }, Validators.required && Validators.minLength(3)],
      operator: [{ value: null, disabled: true }, Validators.required],
      term: [{ value: null, disabled: true }, Validators.required],
      script: [{ value: false, disabled: true }, Validators.required],
    }),
    dimensions: this.formBuilder.array([]),
    condition: this.factEditService.buildNewCondition(false),
    isTemplate: [false, Validators.required],
    parameters: this.formBuilder.array([])
  });

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private factService: FactService,
    private modelService: ModelService,
    private factEditService: FactEditService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private headerService: HeaderService,
    private router: Router
  ) { }

  public ngOnInit() {
    this.creationMode = this.route.snapshot.data.creationMode;
    this.headerService.changeVisibility(false);
    this.translate.get('settings.fact').subscribe(translation => {
      this.factTranslation = translation;
    });

    this.factEditForm.get('model').valueChanges.subscribe((modelName) => {
      if (modelName === '') {
        this.disableAll();
        return;
      }
      this.updateModelTerms(modelName);
      this.enableAll();
    });

    this.route.params.subscribe((params) => {
      this.factId = params.id;
      if (this.factId) {
        this.mapFactToForm();
      } else {
        this.updateForm().toPromise();
      }
    });
  }

  public ngOnDestroy(): void {
    this.headerService.changeVisibility(true);
  }

  public getDimensions(): FormArray {
    return this.factEditForm.get('dimensions') as FormArray;
  }

  public removeFormDimension(i: number): void {
    const dimensions = this.getDimensions();
    dimensions.removeAt(i);
    dimensions.markAsDirty();
  }

  public addFormDimension(): void {
    const newConditionsGroup: FormGroup = this.formBuilder.group({
      operator: [{ value: '', disabled: true }, Validators.required],
      term: [{ value: '', disabled: true }, Validators.required],
      option: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }, Validators.minLength(3)],
    });
    if (this.factEditForm.get('model').value !== '') {
      newConditionsGroup.enable();
    }

    const dimensions = this.getDimensions();
    dimensions.push(newConditionsGroup);
    dimensions.markAsDirty();
  }

  public deleteParameter(fieldForm: FormGroup, index: number): void {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    this.factEditForm.markAsDirty();
  }

  public addNewParameter(fieldForm: FormGroup): void {
    const parameters = fieldForm.get('parameters') as FormArray;
    parameters.push(
      this.formBuilder.group({
        key: this.formBuilder.control('')
      })
    );
    this.factEditForm.markAsDirty();
  }

  public isDirty(): boolean {
    return this.factEditForm.dirty;
  }

  public save(): void {
    if (this.factEditForm.invalid) {
      this.wasValidated = true;
      return;
    }

    const factValue: FactDefinition = this.convertFormToFact();
    if (this.creationMode) {
      this.factService.create(factValue).subscribe(res => {
        this.return();
        this.snackBar.open(this.factTranslation.saved, null, { duration: 2000 });
      });
    } else {
      this.factService.update(this.factId, factValue).subscribe(res => {
        this.wasValidated = false;
        this.factEditForm.markAsPristine();
        this.snackBar.open(this.factTranslation.saved, null, { duration: 2000 });
      });
    }
  }

  public return(): void {
    this.router.navigate(['/settings/facts']);
  }

  public cancel(): void {
    if (this.creationMode) {
      this.return();
    } else {
      this.mapFactToForm();
    }
  }

  public delete(): void {
    if (!this.factId) { return; }
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.fact.component.deletewindow.title',
        content: 'settings.fact.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.factService.delete(this.factId).subscribe(() => {
          this.snackBar.open(`
          ${this.factTranslation['delete-fact-pop-up-information'].fact}
          ${this.factEditForm.value.name}
          ${this.factTranslation['delete-fact-pop-up-information']['is-now-deleted']}
          `, null, { duration: 2000 });
        });
        this.return();
      }
    });
  }

  // public testFact(): void {
  //   const dialogRef = this.dialog.open(FactTestComponent, {
  //     width: '40%',
  //     height: '50vh',
  //     data: { fact: this.convertFormToFact() }
  //   });
  //   dialogRef.afterClosed().subscribe((data) => {
  //     if (!data) { return; }
  //     this.factService.test(
  //       data.fact,
  //       data.testFields.timestamp,
  //       parseInt(data.testFields.hits, 10),
  //       parseInt(data.testFields.offset, 10),
  //       data.testFields.placeholders,
  //       'false'
  //       // TODO replace with json formatter when done
  //     ).subscribe(res => {
  //       this.snackBar.open(this.factTranslation.test.ok, null, { duration: 2000 });
  //     }, err => {
  //       this.snackBar.open(this.factTranslation.test.ko, null, { duration: 2000 });
  //     });
  //   });
  // }

  private updateForm(): Observable<Models> {
    const modelsObservable = this.modelService.list();
    return modelsObservable.pipe(mergeMap(rawModels => {
      const modelsMap = new Map(Object.entries(rawModels));
      this.models = Array.from(modelsMap.values());
      return modelsObservable;
    }));
  }

  private updateModelTerms(modelName: string): void {
    const model = this.models.find((m) => m.name === modelName);
    this.modelTerms = flattenModelFields(model).filter((term) => term.type !== ModelFieldType.Object) as ModelField[];
  }

  private enableAll(): void {
    this.factEditForm.get('intent').enable();
    this.factEditForm.get('dimensions').enable();
    this.factEditForm.get('condition').enable();
  }

  private disableAll(): void {
    this.factEditForm.get('intent').disable();
    this.factEditForm.get('dimensions').disable();
    this.factEditForm.get('condition').disable();
  }

  private mapFactToForm(): void {
    this.factService.read(this.factId).subscribe((fact) => {
      this.factName = fact.name;
      this.updateForm().subscribe(() => {
        this.convertFactToForm(fact);
        this.wasValidated = false;
        this.factEditForm.markAsPristine();
      });
    },
      (err) => {
        this.snackBar.open(this.factTranslation.notfound, null, { duration: 100000, panelClass: ['error-snackbar'] });
        this.return();
      });
  }

  private convertFactToForm(fact: FactDefinition): void {
    this.factEditForm.get('id').setValue(fact.id);
    this.factEditForm.get('name').setValue(fact.name);
    this.factEditForm.get('calculationDepth').setValue(fact.calculationDepth);
    this.factEditForm.get('isTemplate').setValue(fact.isTemplate);
    if (fact.isTemplate) {
      this.factEditForm.setControl('parameters', this.mapParametersToForm(fact.variables));
    }
    this.factEditForm.get('intent').setValue({ script: false, name: '', ...fact.intent });
    this.factEditForm.get('model').setValue(fact.model);
    this.factEditForm.setControl('dimensions', this.mapFactDimensionsToForm(fact.dimensions));
    this.factEditForm.setControl('condition', this.factEditService.mapConditionToForm(fact.condition));
  }

  private convertFormToFact(): FactDefinition {
    const factValue: FactDefinition = {
      name: this.factEditForm.get('name').value,
      model: this.factEditForm.get('model').value,
      calculationDepth: this.factEditForm.get('calculationDepth').value,
      intent: this.factEditForm.get('intent').value,
      isObject: false,
      isTemplate: this.factEditForm.get('isTemplate').value,
    };
    const finalDimensions = this.extractDimensionsFromForm();
    if (finalDimensions && finalDimensions.length > 0) {
      factValue.dimensions = finalDimensions;
    }
    const finalCondition = this.factEditService.extractConditionFromForm(this.factEditForm.get('condition') as FormGroup);
    if (finalCondition) {
      factValue.condition = finalCondition;
    }
    if (factValue.isTemplate) {
      const finalParameters = this.extractParametersFromForm(this.factEditForm.get('parameters') as FormArray);
      if (finalParameters) {
        factValue.variables = finalParameters;
      }
    }
    return factValue;
  }

  private mapFactDimensionsToForm(dimensions: FactDimension[]): FormArray {
    let result = [];
    if (dimensions) {
      result = dimensions.map((element) => {
        let option = {};
        switch (element.operator) {
          case FactDimensionOperator.By: {
            option = element.size ? element.size.toString() : '';
            break;
          }
          case FactDimensionOperator.Histogram: {
            option = element.interval ? element.interval.toString() : '';
            break;
          }
          case FactDimensionOperator.Datehistogram: {
            option = element.dateinterval ? element.dateinterval.toString() : '';
            break;
          }
        }
        return this.formBuilder.group({
          name: element.name,
          operator: element.operator,
          term: element.term,
          option
        });
      });
    }
    return this.formBuilder.array(result);
  }

  private extractDimensionsFromForm(): FactDimension[] {
    const result = this.getDimensions().controls
      .map((dimension) => {
        const operator = dimension.get('operator').value;
        const d = {
          name: dimension.get('name').value,
          operator,
          term: dimension.get('term').value
        };

        switch (operator) {
          case FactDimensionOperator.By: {
            d[FactDimensionOptions.By] = parseInt(dimension.get('option').value, 10);
            break;
          }
          case FactDimensionOperator.Histogram: {
            d[FactDimensionOptions.Histogram] = parseInt(dimension.get('option').value, 10);
            break;
          }
          case FactDimensionOperator.Datehistogram: {
            d[FactDimensionOptions.Datehistogram] = dimension.get('option').value;
            break;
          }
        }
        return d;
      });
    return result;
  }


  private mapParametersToForm(parameters: string[]): FormArray {
    const parametersForm = this.formBuilder.array([]);
    if (parameters) {
      for (const entry of parameters) {
        parametersForm.push(
          this.formBuilder.group({
            key: this.formBuilder.control(entry)
          })
        );
      }
    }

    return parametersForm;
  }

  extractParametersFromForm(formArray: FormArray): string[] {
    const parameters: string[] = [];
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      parameters.push(key);
    }
    return parameters;
  }
}
