import { Injectable, EventEmitter } from '@angular/core';
import { SettingsTableRow, SettingsTableElementClasses, SettingsTableElementInHeader } from 'src/app/shared/models/settings-table';
import { Icons } from 'src/app/shared/constants/icons';
import { Task } from '../interfaces/rule';

@Injectable({
  providedIn: 'root'
})
export class TaskService {


  constructor() { }

  public getExternTaskTabHeader(): SettingsTableElementInHeader[] {
    return [
      {
        text: 'settings.businessrulecasetask.attribute.type.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_4]
      },
      {
        text: 'settings.businessrulecasetask.attribute.level.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  public transformInterTaskToRow(task: Task, deleteEmitter: EventEmitter<number>, displayEmitter: EventEmitter<number>): SettingsTableRow {
    return {
      objectId: task.index,
      click: displayEmitter,
      rowElements: [
        {
          text: task.type,
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: (task.index + 1).toString(),
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: task.task.key,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          text: task.task.value,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          icon: Icons.TRASH.name,
          classes: [SettingsTableElementClasses.COL],
          click: deleteEmitter
        }
      ]
    };
  }

  public getInternTaskHeader(): SettingsTableElementInHeader[] {
    return [
      {
        text: 'settings.businessrulecasetask.attribute.type.label',
        classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
      },
      {
        text: 'settings.businessrulecasetask.attribute.executionorder.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.businessrulecasetask.attribute.key.label',
        classes: [SettingsTableElementClasses.COL_3]
      },
      {
        text: 'settings.businessrulecasetask.attribute.value.label',
        classes: [SettingsTableElementClasses.COL_4]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  public transformExternTaskToRow(task: Task, deleteEmitter: EventEmitter<number>, displayEmitter: EventEmitter<number>): SettingsTableRow {
    return {
      objectId: task.index,
      click: displayEmitter,
      rowElements: [
        {
          text: task.type,
          classes: [SettingsTableElementClasses.COL_2, SettingsTableElementClasses.BOLD]
        },
        {
          text: task.task.id,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: task.task.name,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          text: task.task.level,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          icon: Icons.TRASH.name,
          classes: [SettingsTableElementClasses.COL],
          click: deleteEmitter
        }
      ]
    };
  }

}
