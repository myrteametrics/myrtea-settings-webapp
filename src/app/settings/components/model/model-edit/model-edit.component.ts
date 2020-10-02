import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatSnackBar, MAT_SNACK_BAR_DEFAULT_OPTIONS, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelService } from '../../../services/model.service';
import { TranslateService } from '@ngx-translate/core';
import { ModelDefinition, ModelObjectField, ModelField, ModelFieldType, AdvancedSettings } from '../../../interfaces/model';
import { Icons } from '../../../../shared/constants/icons';
import { HeaderService } from 'src/app/header/services/header.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';

@Component({
  selector: 'app-model-edit',
  templateUrl: './model-edit.component.html',
  styleUrls: ['./model-edit.component.scss'],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } }
  ]
})
export class ModelEditComponent implements OnInit, OnDestroy {


  public icons = Icons;

  public creationMode: boolean;
  public modelId: number;
  public modelName: string;

  public fieldTypes: [string, ModelFieldType][];

  private translations: any;

  public wasValidated = false;
  public modelEditForm: FormGroup = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    synonyms: '',
    fields: this.formBuilder.array([]),
    elasticsearchOptions: this.formBuilder.group({
      rollmode: [{ value: 'cron', disabled: true }, Validators.required],
      rollcron: ['', Validators.required],
      enablePurge: ['', Validators.required],
      purgeMaxConcurrentIndices: ['', Validators.required],
      patchAliasMaxIndices: ['', Validators.required],
      advancedSettings: this.formBuilder.array([])
    })
  });

  constructor(
    private route: ActivatedRoute,
    private modelService: ModelService,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private headerService: HeaderService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.headerService.changeVisibility(false);
    this.creationMode = this.route.snapshot.data.creationMode;

    this.translateService.get('settings.model').subscribe(translations => {
      this.translations = translations;
    });
    this.fieldTypes = Object.entries(ModelFieldType);
    this.route.params.subscribe((params) => {
      this.modelId = (params.id as number);
      if (this.modelId) {
        this.loadForm();
      }
    });
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

  private loadForm() {
    this.modelService.read(this.modelId).subscribe((model) => {
      this.modelName = model.name;

      this.modelEditForm.get('id').setValue(this.modelId);
      this.modelEditForm.get('name').setValue(model.name);
      this.modelEditForm.get('synonyms').setValue(model.synonyms ? model.synonyms.join(',') : '');
      this.modelEditForm.setControl('fields', this.buildFieldsForm(this.formBuilder.array([]), model.fields));

      this.modelEditForm.get('elasticsearchOptions.rollmode').setValue(model.elasticsearchOptions.rollmode);
      this.modelEditForm.get('elasticsearchOptions.rollcron').setValue(model.elasticsearchOptions.rollcron);
      this.modelEditForm.get('elasticsearchOptions.enablePurge').setValue(model.elasticsearchOptions.enablePurge);
      this.modelEditForm
        .get('elasticsearchOptions.purgeMaxConcurrentIndices')
        .setValue(model.elasticsearchOptions.purgeMaxConcurrentIndices);
      this.modelEditForm.get('elasticsearchOptions.patchAliasMaxIndices').setValue(model.elasticsearchOptions.patchAliasMaxIndices);
      (this.modelEditForm.get('elasticsearchOptions') as FormGroup).setControl(
        'advancedSettings',
        this.buildAdvancedSettingsForm(model.elasticsearchOptions.advancedSettings)
      );
    });
  }

  private buildAdvancedSettingsForm(settings: AdvancedSettings): FormArray {
    const settingsForm = this.formBuilder.array([]);
    if (settings) {
      for (const a of Object.entries(settings)) {
        const key = a[0];
        const value = a[1];
        settingsForm.push(
          this.formBuilder.group({
            key: [key, Validators.required],
            value: [value, Validators.required]
          })
        );
      }
    }
    return settingsForm;
  }

  public addNewChildField(fieldForm: FormGroup) {
    const group = this.formBuilder.group({
      name: this.formBuilder.control(''),
      type: this.formBuilder.control(''),
      synonyms: this.formBuilder.control(''),
      keepObjectSeparation: this.formBuilder.control(false),
      fields: this.formBuilder.array([])
    });
    group.get('type').valueChanges.subscribe(val => {
      if (val === ModelFieldType.Object) {
        this.addNewChildField(group);
      } else {
        (group.get('fields') as FormArray).clear();
      }
    });

    const parent = fieldForm.get('fields') as FormArray;
    parent.push(group);
    parent.markAsDirty();
  }

  public deleteField(fieldForm: FormGroup, index: number) {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    parent.markAsDirty();
  }

  public addNewChildAdvancedSettings(fieldForm: FormGroup) {
    const advancedSettings = fieldForm.get('advancedSettings') as FormArray;
    advancedSettings.push(
      this.formBuilder.group({
        key: this.formBuilder.control('', Validators.required),
        value: this.formBuilder.control('', Validators.required)
      })
    );
  }

  public deleteAdvancedSettings(fieldForm: FormGroup, index: number) {
    const parent = (fieldForm.parent as FormArray);
    parent.removeAt(index);
    parent.markAsDirty();
  }

  private buildFieldsForm(fieldForm: FormArray, fields: (ModelObjectField | ModelField)[]): FormArray {
    for (const field of fields) {
      let subFields = this.formBuilder.array([]);
      if (field.type === ModelFieldType.Object) {
        subFields = this.buildFieldsForm(subFields, (field as ModelObjectField).fields);
      }
      const group = this.formBuilder.group({
        name: [field.name, Validators.required],
        type: [field.type, Validators.required],
        synonyms: (field as ModelField).synonyms ? (field as ModelField).synonyms.join(',') : '',
        keepObjectSeparation: [(field as ModelObjectField).keepObjectSeparation || false, Validators.required],
        fields: subFields
      });
      group.get('type').valueChanges.subscribe(val => {
        if (val === ModelFieldType.Object) {
          this.addNewChildField(group);
        } else {
          (group.get('fields') as FormArray).clear();
        }
      });
      fieldForm.push(group);
    }
    return fieldForm;
  }

  public isFieldFormLeaf(field: FormGroup): boolean {
    return field && !(field.get('type').value === ModelFieldType.Object);
  }

  public onReturn() {
    this.router.navigate([`/settings/models`]);
  }

  public onCancel() {
    if (this.modelId) {
      this.loadForm(); // Reset form with remote object
      this.modelEditForm.markAsPristine();
    } else {
      this.onReturn();
    }
  }

  public onSave() {
    if (!this.modelEditForm.valid) {
      this.wasValidated = true;
      return;
    }

    const fields = this.extractFields(this.modelEditForm.get('fields') as FormArray);

    const purgeMaxConcurrentIndices = this.modelEditForm.get('elasticsearchOptions.purgeMaxConcurrentIndices').value;
    const patchAliasMaxIndices = this.modelEditForm.get('elasticsearchOptions.patchAliasMaxIndices').value;
    const model: ModelDefinition = {
      name: (this.modelEditForm.get('name').value as string).trim(),
      synonyms: (this.modelEditForm.get('synonyms').value as string).split(',').map(item => item.trim()).filter(item => !!item),
      fields,
      elasticsearchOptions: {
        rollmode: this.modelEditForm.get('elasticsearchOptions').get('rollmode').value,
        rollcron: this.modelEditForm.get('elasticsearchOptions').get('rollcron').value,
        enablePurge: this.modelEditForm.get('elasticsearchOptions').get('enablePurge').value,
        purgeMaxConcurrentIndices,
        patchAliasMaxIndices,
        advancedSettings: this.extractAdvancedSettings(this.modelEditForm.get('elasticsearchOptions').get('advancedSettings') as FormArray)
      }
    };

    if (this.modelId) {
      this.modelService.update(this.modelId, model).subscribe(
        (resp) => {
          this.wasValidated = false;
          this.modelEditForm.markAsPristine();
          this.snackBar.open(`${this.translations['message.success']}`, null, { panelClass: ['success-snackbar'] });
        }, (err) => {
          this.snackBar.open(`${this.translations['message.error']}`, null, { panelClass: ['error-snackbar'] });
        }
      );

    } else {
      this.modelService.create(model).subscribe(
        (resp) => {
          this.snackBar.open(`${this.translations['message.success']}`, null, { panelClass: ['success-snackbar'] });
          this.router.navigate(['/settings/models']);
        }, (err) => {
          this.snackBar.open(`${this.translations['message.error']}`, null, { panelClass: ['error-snackbar'] });
        }
      );
    }
  }

  public onDelete() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.model.component.deletewindow.title',
        content: 'settings.model.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        if (this.modelId) {
          this.modelService.delete(this.modelId).subscribe(
            (resp) => {
              this.snackBar.open(`${this.translations['message.success']}`, null, { panelClass: ['success-snackbar'] });
              this.router.navigate(['/settings/models']);
            }, (err) => {
              this.snackBar.open(`${this.translations['message.error']}`, null, { panelClass: ['error-snackbar'] });
            }
          );
        }
      }
    });
  }

  extractFields(formArray: FormArray): (ModelObjectField | ModelField)[] {
    const fields: (ModelObjectField | ModelField)[] = [];

    for (const control of formArray.controls) {
      if (control.get('type').value === ModelFieldType.Object) {
        const field: ModelObjectField = {
          name: (control.get('name').value as string).trim(),
          type: control.get('type').value,
          keepObjectSeparation: control.get('keepObjectSeparation').value,
          fields: this.extractFields(control.get('fields') as FormArray)
        };
        fields.push(field);

      } else {
        const field: ModelField = {
          name: (control.get('name').value as string).trim(),
          type: control.get('type').value,
          synonyms: (control.get('synonyms').value as string).split(',').map(item => item.trim()).filter(item => !!item),
        };
        fields.push(field);
      }
    }
    return fields;
  }

  extractAdvancedSettings(formArray: FormArray): AdvancedSettings {
    const settings = {};
    for (const control of formArray.controls) {
      const key = (control.get('key').value as string).trim();
      const value = control.get('value').value;
      settings[key] = value;
    }
    return settings;
  }
}

