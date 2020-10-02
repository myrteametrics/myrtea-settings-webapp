import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { TableSettingsData } from 'src/app/shared/models/settings-table';
import { CaseService } from 'src/app/settings/services/case.service';
import { BusinessRuleState } from 'src/app/settings/interfaces/states/business-rule-state';
import { BusinessRuleEditService } from 'src/app/settings/components/business-rule/business-rule-edit/business-rule-edit.service';
import { RuleCase } from 'src/app/settings/interfaces/rule';

@Component({
  selector: 'app-business-rule-case-composition',
  templateUrl: './business-rule-case-composition.component.html',
  styleUrls: ['./business-rule-case-composition.component.scss']
})
export class BusinessRuleCaseCompositionComponent implements OnInit {

  public icons = Icons;
  public conditionsTableSettingsData: TableSettingsData = {
    header: this.caseService.getCaseTabHeader(),
    rows: []
  };
  private deleteCaseEmitter = new EventEmitter<number>();
  private displayCaseEmitter = new EventEmitter<number>();
  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  constructor(
    private caseService: CaseService,
    private businessRuleEditService: BusinessRuleEditService
  ) { }

  ngOnInit() {
    this.deleteCaseEmitter.subscribe((indexCase: number) => {
      this.businessRuleEditService.deleteCase(indexCase);
      this.isDirtyEmitter.emit(true);
    });
    this.businessRuleEditService.changeOnCasesEmitter.subscribe((ruleCases: RuleCase[]) => {
      this.insertCaseInTab(ruleCases);
      this.isDirtyEmitter.emit(true);
    });
    this.displayCaseEmitter.subscribe((indexCase: number) => this.businessRuleEditService.displayCase(indexCase));
    this.insertCaseInTab(this.businessRuleEditService.getCases());
  }

  private insertCaseInTab(ruleCases: RuleCase[]) {
    this.conditionsTableSettingsData.rows = ruleCases.map((ruleCase: RuleCase) => {
      return this.caseService.transformCaseToRow(
        ruleCase,
        this.deleteCaseEmitter,
        this.displayCaseEmitter
      );
    });
  }

  public redirectUserToCreateCase() {
    this.businessRuleEditService.setState(BusinessRuleState.CASECREATION);
  }

}
