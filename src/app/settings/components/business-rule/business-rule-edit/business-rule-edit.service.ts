import { BusinessRuleState } from 'src/app/settings/interfaces/states/business-rule-state';
import { RuleService } from 'src/app/settings/services/rule.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';

import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RuleCase, Rule, Task, Action } from 'src/app/settings/interfaces/rule';

@Injectable({
  providedIn: 'root'
})
export class BusinessRuleEditService {

  public currentState: BusinessRuleState;
  public selectedCase: RuleCase;
  public currentRule: Rule;
  public changeStateEmitter = new EventEmitter<BusinessRuleState>();
  public changeOnCasesEmitter = new EventEmitter<RuleCase[]>();
  public changeOnSelectedCase = new EventEmitter<RuleCase>();
  public noMoreOptions;
  public creationMode: boolean;

  constructor(
    private ruleService: RuleService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  public addAction(action: Action): void {
    if (!this.selectedCase.actions) {
      this.selectedCase.actions = [];
    }
    this.selectedCase.actions.push(action);
    this.changeOnSelectedCase.emit(this.selectedCase);
  }

  public deleteAction(actionIndex: number): void {
    this.selectedCase.actions = this.selectedCase.actions.filter((action: Action, index: number) => actionIndex !== index);
    this.changeOnSelectedCase.emit(this.selectedCase);
  }

  public modifyAction(action: Action, actionIndex: number): void {
    this.selectedCase.actions[actionIndex] = action;
    this.changeOnSelectedCase.emit(this.selectedCase);
  }

  public setCreationModeTrue() {
    this.currentRule = {};
    this.creationMode = true;
    this.changeOnCasesEmitter.emit(this.getCases());
    this.setState(BusinessRuleState.EDITION);
  }

  public setCurrentRule(rule: Rule) {
    this.creationMode = false;
    this.currentRule = rule;
    this.setIndex();
    this.changeOnCasesEmitter.emit(this.getCases());
    this.setState(BusinessRuleState.EDITION);
  }

  public setState(newState: BusinessRuleState) {
    if (newState === BusinessRuleState.CASECREATION) {
      this.selectedCase = { tasks: [] };
    }
    this.currentState = newState;
    if (this.creationMode && newState === BusinessRuleState.EDITION) {
      this.noMoreOptions = true;
    } else {
      this.noMoreOptions = !(newState === BusinessRuleState.EDITION || newState === BusinessRuleState.CASEEDITION);
    }
    this.changeStateEmitter.emit(this.currentState);
  }

  public resetSelectCase() {
    const indexCase = this.selectedCase.index;
    this.selectedCase = JSON.parse(JSON.stringify(this.currentRule.cases[indexCase]));
    if (!this.selectedCase.tasks) {
      this.selectedCase.tasks = [];
    }
  }

  public getSituationsInCurrentRule() {
    return this.ruleService.getSituationsInRule(this.currentRule.id);
  }

  public modifyCase(modifiedCase: RuleCase, indexCase: number) {
    this.currentRule.cases[indexCase] = modifiedCase;
    this.changeOnCasesEmitter.emit(this.getCases());
    this.setState(BusinessRuleState.EDITION);
  }

  public addCase(newRuleCase: RuleCase) {
    this.currentRule.cases.push(newRuleCase);
    this.setIndex();
    this.changeOnCasesEmitter.emit(this.getCases());
    this.setState(BusinessRuleState.EDITION);
  }

  public displayCase(indexCase: number) {
    this.selectedCase = JSON.parse(JSON.stringify(this.currentRule.cases[indexCase]));
    if (!this.selectedCase.tasks) {
      this.selectedCase.tasks = [];
    }
    this.setState(BusinessRuleState.CASEEDITION);
  }

  public saveSelectedCaseInCurrentRule() {
    this.currentRule.cases[this.selectedCase.index] = this.selectedCase;
    this.setIndex();
    this.changeOnCasesEmitter.emit(this.getCases());
  }

  public deleteCase(indexCase: number) {
    this.currentRule.cases = this.currentRule.cases
      .filter((ruleCase: RuleCase) => ruleCase.index !== indexCase);
    this.setIndex();
    this.changeOnCasesEmitter.emit(this.getCases());
  }

  public getCases(): RuleCase[] {
    if (!this.currentRule.cases) {
      this.currentRule.cases = [];
    }
    return this.currentRule.cases;
  }

  private setIndex() {
    this.currentRule.cases.map((ruleCase: RuleCase, index: number) => {
      ruleCase.index = index;
      if (ruleCase.tasks) {
        ruleCase.tasks.map((task: Task, taskIndex: number) => task.index = taskIndex);
      }
    });
    if (this.selectedCase) {
      this.selectedCase.tasks.map((task: Task, taskIndex: number) => task.index = taskIndex);
    }
  }

  public displayDelete() {
    if (this.currentState === BusinessRuleState.EDITION) {
      this.displayDeleteRule();
    }
    if (this.currentState === BusinessRuleState.CASEEDITION) {
      this.displayDeleteCase();
    }
  }

  private displayDeleteCase() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.businessrulecase.component.deletewindow.title',
        content: 'settings.businessrulecase.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.deleteCase(this.selectedCase.index);
        this.setState(BusinessRuleState.EDITION);
      }
    });
  }

  private displayDeleteRule() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.businessrule.component.deletewindow.title',
        content: 'settings.businessrule.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.ruleService.delete(this.currentRule.id).subscribe(() => this.return());
      }
    });
  }

  public return() {
    if (this.currentState === BusinessRuleState.EDITION) {
      this.router.navigate(['/settings/business-rules']);
    } else {
      this.setState(BusinessRuleState.EDITION);
    }
  }



}
