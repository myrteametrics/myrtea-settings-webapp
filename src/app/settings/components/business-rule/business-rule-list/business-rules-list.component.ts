import { Component, OnInit, EventEmitter } from '@angular/core';
import { RuleService } from 'src/app/settings/services/rule.service';
import { Icons } from 'src/app/shared/constants/icons';
import { Rule } from 'src/app/settings/interfaces/rule';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';
import { MatDialog } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-rules-list',
  templateUrl: './business-rules-list.component.html',
  styleUrls: ['./business-rules-list.component.scss']
})
export class BusinessRulesListComponent implements OnInit {

  public icons = Icons;
  private rules: Rule[];
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public deleteBREmitter: EventEmitter<number> = new EventEmitter();
  public displayBREmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private ruleService: RuleService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.deleteBREmitter.subscribe((bRId: number): void => {
      this.deleteBusinessRule(bRId);
    });
    this.displayBREmitter.subscribe((bRId: number): void => {
      this.displayBusinessRule(bRId);
    });
    this.ruleService.list().subscribe((rules: Rule[]) => {
      this.rules = rules;
      this.insertDataInTabs(this.rules);
    });
  }

  public displayBusinessRule(id: number) {
    this.router.navigate(['/settings/business-rules', id]);
  }

  private insertDataInTabs(rules: Rule[]) {
    this.tableSettingsData.header = [
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
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
    this.tableSettingsData.rows = rules.map((rule: Rule) => this.transformRuleToRow(rule));
  }

  public searchBusinessRules(value: string) {
    this.tableSettingsData.rows = this.rules
      .filter((rule: Rule) => rule.name.includes(value))
      .map((rule: Rule) => this.transformRuleToRow(rule));
  }

  public deleteBusinessRule(id: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.businessrule.component.deletewindow.title',
        content: 'settings.businessrule.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.ruleService.delete(id).subscribe(() => {
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
        });
      }
    });

  }

  private transformRuleToRow(rule: Rule): SettingsTableRow {
    return {
      objectId: rule.id,
      click: this.displayBREmitter,
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
          click: this.deleteBREmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

}
