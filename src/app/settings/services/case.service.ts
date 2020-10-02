import { Injectable, EventEmitter } from '@angular/core';
import { SettingsTableRow, SettingsTableElementClasses, SettingsTableElementInHeader } from 'src/app/shared/models/settings-table';
import { RuleCase } from '../interfaces/rule';
import { Icons } from 'src/app/shared/constants/icons';

@Injectable({
  providedIn: 'root'
})
export class CaseService {

  constructor() { }

  public getCaseTabHeader(): SettingsTableElementInHeader[] {
    return [
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3, SettingsTableElementClasses.BOLD]
      },
      {
        text: 'settings.businessrulecase.label',
        classes: [SettingsTableElementClasses.COL_5]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }


  public transformCaseToRow(
    ruleCase: RuleCase,
    deleteEmitter: EventEmitter<number>,
    displayEmitter: EventEmitter<number>
  ): SettingsTableRow {
    return {
      objectId: ruleCase.index,
      click: displayEmitter,
      rowElements: [
        {
          text: ruleCase.name,
          classes: [SettingsTableElementClasses.COL_3, SettingsTableElementClasses.BOLD]
        },
        {
          text: ruleCase.condition,
          classes: [SettingsTableElementClasses.COL_5]
        },
        {
          icon: Icons.TRASH.name,
          click: deleteEmitter,
          classes: [SettingsTableElementClasses.COL]
        }
      ]
    };
  }
}
