import {
  FactConditionGroup, FactConditionGroupOperator, FactConditionLeaf, FactConditionLeafOperator
} from 'src/app/settings/interfaces/fact';

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FactEditService {

  public groupOperators: string[] = Object.values(FactConditionGroupOperator).filter(value => typeof value === 'string') as string[];
  public leafOperators: string[] = Object.values(FactConditionLeafOperator).filter(value => typeof value === 'string') as string[];

  constructor(private readonly formBuilder: FormBuilder) { }

  public buildNewCondition(enabled: boolean): FormGroup {

    const group = this.formBuilder.group({
      operator: [{ value: '', disabled: !enabled }],
      expression: this.formBuilder.control('')
    });
    group.get('operator').valueChanges.subscribe(operator => {
      group.removeControl('term');
      group.removeControl('value');
      group.removeControl('value2');
      if (this.groupOperators.includes(operator as FactConditionGroupOperator)) {
        group.setControl('fragments', this.formBuilder.array([]));
        this.addSubCondition(group);
      } else {
        switch (operator) {
          case FactConditionLeafOperator.Between:
            group.setControl('value2', this.formBuilder.control(''));
          /* falls through */
          case FactConditionLeafOperator.For:
          /* falls through */
          case FactConditionLeafOperator.From:
          /* falls through */
          case FactConditionLeafOperator.To:
            group.setControl('value', this.formBuilder.control(''));
          /* falls through */
          case FactConditionLeafOperator.Exists:
          /* falls through */
          case FactConditionLeafOperator.Script:
            group.setControl('term', this.formBuilder.control(''));
        }
      }
    });
    return group;
  }

  public addSubCondition(parentCondition: FormGroup): void {
    const group = this.buildNewCondition(true);
    const parent = parentCondition.get('fragments') as FormArray;
    parent.push(group);
    parent.markAsDirty();
  }

  public mapConditionToForm(condition: FactConditionGroup | FactConditionLeaf): FormGroup {
    const newCondition = this.buildNewCondition(true);
    if (!condition) {
      return newCondition;
    }
    if (condition.operator && this.groupOperators.includes(condition.operator.toString())) {
      const groupForm = condition as FactConditionGroup;
      if (condition.operator === FactConditionGroupOperator.If) {
        newCondition.setControl('expression', this.formBuilder.control(condition.expression));
      }
      newCondition.get('operator').setValue(groupForm.operator);
      newCondition.setControl('fragments', this.formBuilder.array(groupForm.fragments.map(fragment => this.mapConditionToForm(fragment))));
      return newCondition;
    }

    const leafForm = condition as FactConditionLeaf;
    newCondition.get('operator').setValue(leafForm.operator);
    newCondition.get('term').setValue(leafForm.term);
    if (leafForm.value) {
      newCondition.get('value').setValue(leafForm.value);
    }
    if (leafForm.value2) {
      newCondition.get('value2').setValue(leafForm.value2);
    }
    return newCondition;
  }

  public extractConditionFromForm(formGroup: FormGroup): FactConditionGroup | FactConditionLeaf {
    const operator = formGroup.get('operator').value;
    if (!operator) {
      return undefined;
    }

    if (this.groupOperators.includes(operator.toString())) {
      const fragments: (FactConditionGroup | FactConditionLeaf)[] = [];
      const subConditions = formGroup.get('fragments') as FormArray;
      subConditions.controls.map((frag: FormGroup) => {
        const subCondition = this.extractConditionFromForm(frag);
        fragments.push(subCondition);
      });

      let conditionGroup: FactConditionGroup = {
        operator,
        fragments
      };
      if (operator === FactConditionGroupOperator.If) {
        conditionGroup = {
          ...conditionGroup,
          expression: formGroup.value.expression
        };
      }
      return conditionGroup;
    }

    const conditionLeaf: FactConditionLeaf = { operator };
    switch (operator) {
      case FactConditionLeafOperator.Between:
        conditionLeaf.value2 = formGroup.get('value2').value;
      /* falls through */
      case FactConditionLeafOperator.For:
      /* falls through */
      case FactConditionLeafOperator.From:
      /* falls through */
      case FactConditionLeafOperator.To:
        conditionLeaf.value = formGroup.get('value').value;
      /* falls through */
      case FactConditionLeafOperator.Exists:
      /* falls through */
      case FactConditionLeafOperator.Script:
        conditionLeaf.term = formGroup.get('term').value;
    }

    return conditionLeaf;
  }

}
