import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { SituationDefinition } from 'src/app/settings/interfaces/situation';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';
import { MatDialog } from '@angular/material';
import { RuleService } from 'src/app/settings/services/rule.service';
import { Rule } from 'src/app/settings/interfaces/rule';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';
import { SituationService } from 'src/app/settings/services/situation.service';
import { InputWithSuggestionsData } from 'src/app/shared/models/input-with-suggestions';

@Component({
  selector: 'app-situation-business-rule-composition',
  templateUrl: './situation-business-rule-composition.component.html',
  styleUrls: ['./situation-business-rule-composition.component.scss']
})
export class SituationBusinessRuleCompositionComponent implements OnInit {

  public icons = Icons;
  @Input() situation: SituationDefinition;
  @Input() creationMode: boolean;
  public rules: Rule[];
  public ruleTableSettingsData: TableSettingsData = { header: [], rows: [] };
  public rulesWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.businessrule.component.addelement.add',
    elements: []
  };
  private deleteRuleEmitter: EventEmitter<number> = new EventEmitter<number>();
  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  constructor(
    private dialog: MatDialog,
    private ruleService: RuleService,
    private situationService: SituationService
  ) { }

  ngOnInit() {
    this.fetchRules();
    this.deleteRuleEmitter.subscribe((ruleId: number) => this.removeRule(ruleId));
    this.insertHeaderInDataTable();
  }

  private fetchRules() {
    this.ruleService.list().subscribe((rules: Rule[]) => {
      this.rules = rules;
      if (this.creationMode) {
        this.insertRuleInSuggestions(this.rules);
      } else {
        this.fetchRulesInSituation();
      }
    });
  }

  public getRuleIds(): number[] {
    return this.ruleTableSettingsData.rows.map((ruleRow: SettingsTableRow) => ruleRow.objectId);
  }

  private insertRuleInSuggestions(rules: Rule[]) {
    this.rulesWithSuggestions.elements = [];
    rules.forEach((rule: Rule) => {
      if (this.ruleIsInSituation(rule)) { return; }
      this.rulesWithSuggestions.elements.push({
        objectId: rule.id,
        content: rule.name
      });
    });
  }

  private insertHeaderInDataTable() {
    this.ruleTableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_4]
      },
      {
        text: 'settings.businessrule.attribute.status.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  private transformRuleToRow(rule: Rule): SettingsTableRow {
    return {
      objectId: rule.id,
      rowElements: [
        {
          text: rule.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: rule.name,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          text: rule.enabled ? 'On' : 'Off',
          classes: rule.enabled ?
            [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.ON_INDICATOR] :
            [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.OFF_INDICATOR]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteRuleEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  public fetchRulesInSituation() {
    this.situationService.listRules(this.situation.id).subscribe((rules: Rule[]) => {
      this.ruleTableSettingsData.rows = rules.map((rule: Rule) => this.transformRuleToRow(rule));
      this.insertRuleInSuggestions(this.rules);
    });
  }

  private ruleIsInSituation(rule: Rule): boolean {
    const ruleIndex = this.ruleTableSettingsData.rows.findIndex((rows: SettingsTableRow) => rows.objectId === rule.id);
    if (ruleIndex === -1) { return false; }
    return true;
  }

  public addRule(id: number) {
    this.isDirtyEmitter.emit(true);
    const rulesToAdd = this.rules.find((rule: Rule) => rule.id === id);
    this.ruleTableSettingsData.rows.push(this.transformRuleToRow(rulesToAdd));
    this.insertRuleInSuggestions(this.rules);
  }

  public removeRule(ruleId: number) {
    this.isDirtyEmitter.emit(true);
    this.ruleTableSettingsData.rows = this.ruleTableSettingsData.rows
      .filter((ruleRow: SettingsTableRow) => ruleRow.objectId !== ruleId);
    this.insertRuleInSuggestions(this.rules);
  }

  public displayMultipleRulesSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '60%',
      height: '50vh',
      data: {
        title: 'settings.businessrule.component.addelement.add',
        search: 'settings.businessrule.component.addelement.search',
        selected: 'settings.businessrule.component.addelement.selected',
        elements: this.rules
          .filter((rule: Rule) => !this.ruleIsInSituation(rule))
          .map((rule: Rule): MultipleSelectionElement => {
            return {
              name: rule.name,
              id: rule.id
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addRule(element.id));
    });
  }


}
