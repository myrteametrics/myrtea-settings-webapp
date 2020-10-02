import { FactEditService } from 'src/app/settings/components/fact/fact-edit/fact-edit.service';
import { FactConditionGroupOperator, FactConditionLeafOperator } from 'src/app/settings/interfaces/fact';
import { ModelField } from 'src/app/settings/interfaces/model';
import { Icons } from 'src/app/shared/constants/icons';

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fact-condition',
  templateUrl: './fact-condition.component.html',
  styleUrls: ['./fact-condition.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FactConditionComponent implements OnInit, OnDestroy {

  @Input() public conditionFormGroup: FormGroup;
  @Input() public index: number;
  @Input() public modelTerms: ModelField[];

  public icons = Icons;
  public groupOperators: string[] = Object.values(FactConditionGroupOperator).filter(value => typeof value === 'string') as string[];
  public leafOperators: string[] = Object.values(FactConditionLeafOperator).filter(value => typeof value === 'string') as string[];

  constructor(
    private factEditService: FactEditService
  ) { }

  ngOnInit() { }

  ngOnDestroy() { }

  public isGroupOperator(operator: FactConditionGroupOperator | FactConditionLeafOperator): boolean {
    return this.groupOperators.includes(operator as FactConditionGroupOperator);
  }

  public addSubCondition(parentCondition: FormGroup): void {
    this.factEditService.addSubCondition(parentCondition);
  }

  public deleteCondition(conditionForm: FormGroup, index: number) {
    const parent = (conditionForm.parent as FormArray);
    parent.markAsDirty();
    if (parent instanceof FormArray) {
      parent.removeAt(index);
      return;
    }
    (parent as FormGroup).setControl('condition', this.factEditService.buildNewCondition(true));
  }

}
