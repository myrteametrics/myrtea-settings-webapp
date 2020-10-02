import { BusinessRuleEditService } from 'src/app/settings/components/business-rule/business-rule-edit/business-rule-edit.service';
import { RuleCase } from 'src/app/settings/interfaces/rule';
import { BusinessRuleState } from 'src/app/settings/interfaces/states/business-rule-state';
import { Icons } from 'src/app/shared/constants/icons';
import { SettingsTableElementClasses, SettingsTableRow, TableSettingsData } from 'src/app/shared/models/settings-table';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { BusinessRuleActionEditComponent } from './business-rule-action-edit/business-rule-action-edit.component';

@Component({
  selector: 'app-business-rule-case-edit',
  templateUrl: './business-rule-case-edit.component.html',
  styleUrls: ['./business-rule-case-edit.component.scss']
})
export class BusinessRuleCaseEditComponent implements OnInit {

  public caseForm = this.formBuilder.group({
    name: ['', Validators.required],
    condition: ['', Validators.required]
  });
  public icons = Icons;
  private isDirty = false;
  public actionTableSettingsData: TableSettingsData = {
    header: [
      { text: 'settings.shared.attribute.name.label', classes: [SettingsTableElementClasses.COL_3] },
      { text: '', classes: [SettingsTableElementClasses.COL] }
    ],
    rows: []
  };
  public deleteActionEmitter = new EventEmitter<number>();
  public displayActionEmitter = new EventEmitter<number>();


  constructor(
    private formBuilder: FormBuilder,
    private businessRuleEditService: BusinessRuleEditService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.initCase(this.businessRuleEditService.selectedCase);
    this.displayActionEmitter.subscribe((actionIndex: number) => this.displayEditAction(actionIndex));
    this.deleteActionEmitter.subscribe((actionIndex: number) => this.deleteAction(actionIndex));
    this.businessRuleEditService.changeOnSelectedCase.subscribe((selectedCase: RuleCase) => {
      this.initCase(selectedCase);
      this.isDirty = true;
    });
    this.caseForm.valueChanges.subscribe(() => this.isDirty = true);
  }

  public cancel() {
    if (this.businessRuleEditService.currentState === BusinessRuleState.CASECREATION) {
      this.businessRuleEditService.return();
    } else {
      this.businessRuleEditService.resetSelectCase();
      this.initCase(this.businessRuleEditService.selectedCase);
      this.isDirty = false;
    }
  }

  private deleteAction(actionIndex: number): void {
    this.actionTableSettingsData.rows = this.actionTableSettingsData.rows.filter(
      (row: SettingsTableRow) => row.objectId !== actionIndex
    );
    this.businessRuleEditService.deleteAction(actionIndex);
    this.isDirty = true;
  }

  public formIsValid(): boolean {
    return this.isDirty && this.caseForm.valid;
  }

  public save() {
    // TODO:
    const ruleCase: RuleCase = {
      ... this.businessRuleEditService.selectedCase,
      name: this.caseForm.value.name,
      condition: this.caseForm.value.condition
    };
    if (this.businessRuleEditService.currentState === BusinessRuleState.CASEEDITION) {
      this.businessRuleEditService.modifyCase(ruleCase, ruleCase.index);
    }
    if (this.businessRuleEditService.currentState === BusinessRuleState.CASECREATION) {
      this.businessRuleEditService.addCase(ruleCase);
    }
  }

  private initCase(ruleCase: RuleCase) {
    if (this.businessRuleEditService.currentState !== BusinessRuleState.CASECREATION) {
      this.caseForm.setValue({
        name: ruleCase.name,
        condition: ruleCase.condition
      });
    }
    if (ruleCase.actions) {
      this.actionTableSettingsData.rows = ruleCase.actions.map((action, index) => this.transformActionToRow(action, index));
    }
  }

  private transformActionToRow(action, actionIndex: number): SettingsTableRow {
    return {
      objectId: actionIndex,
      click: this.displayActionEmitter,
      rowElements: [
        {
          text: action.name,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          icon: this.icons.TRASH.name,
          classes: [SettingsTableElementClasses.COL],
          click: this.deleteActionEmitter
        }
      ]
    };
  }

  public displayEditAction(actionIndex: number) {
    this.dialog.open(BusinessRuleActionEditComponent, {
      width: '50%',
      data: {
        creationMode: false,
        action: this.businessRuleEditService.selectedCase.actions[actionIndex],
        actionIndex
      }
    });
  }

  public displayCreateAction() {
    this.dialog.open(BusinessRuleActionEditComponent, {
      width: '50%',
      data: {
        creationMode: true
      }
    });
  }

}

