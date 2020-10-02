import {
  SituationInstanceEditComponent
} from './situation-instance-edit/situation-instance-edit.component';
import { SituationDefinition, SituationInstanceDefinition } from 'src/app/settings/interfaces/situation';
import { SituationService } from 'src/app/settings/services/situation.service';
import { Icons } from 'src/app/shared/constants/icons';
import { SettingsTableElementClasses, SettingsTableRow, TableSettingsData } from 'src/app/shared/models/settings-table';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';

@Component({
  selector: 'app-situation-instance-composition',
  templateUrl: './situation-instance-composition.component.html',
  styleUrls: ['./situation-instance-composition.component.scss']
})
export class SituationInstanceCompositionComponent implements OnInit {

  public icons = Icons;

  @Input() situation: SituationDefinition;
  @Input() creationMode: boolean;
  @Input() calendars: CalendarDefinition[] = [];

  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  public instanceTableSettingsData: TableSettingsData = { header: [], rows: [] };

  private instances: SituationInstanceDefinition[];
  private deleteInstanceEmitter: EventEmitter<number> = new EventEmitter();
  private displayInstanceEditionEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private situationService: SituationService
  ) { }

  ngOnInit() {
    this.insertHeaderInDataTable();
    this.fetchInstancesInSituation();
    this.deleteInstanceEmitter.subscribe((ruleId: number) => this.removeInstance(ruleId));
    this.displayInstanceEditionEmitter.subscribe((instanceId: number) => {
      this.displayInstanceEditor(instanceId);
    });
  }

  public displayNewInstanceEditor() {
    this.dialog.open(SituationInstanceEditComponent, {
      width: '60%',
      height: '70vh',
      data: {
        creationMode: true,
        instance: {},
        calendars: this.calendars
      }
    }).afterClosed().subscribe((instance: SituationInstanceDefinition) => {
      if (instance) {
        this.addNewInstance(instance);
      }
    });
  }

  public displayInstanceEditor(index: number) {
    this.dialog.open(SituationInstanceEditComponent, {
      width: '60%',
      height: '70vh',
      data: {
        creationMode: false,
        instance: this.instances[index],
        calendars: this.calendars
      }
    }).afterClosed().subscribe((instance: any) => {
      if (instance) {
        this.updateInstance(index, instance);
      }
    });
  }

  public fetchInstancesInSituation() {
    if (this.creationMode) {
      this.instanceTableSettingsData.rows = [];
      this.instances = [];
      return;
    }
    this.situationService.listInstances(this.situation.id).subscribe((instances: SituationInstanceDefinition[]) => {
      this.instances = instances;
      this.refreshTableSettingsData();
    });
  }

  private refreshTableSettingsData() {
    this.instanceTableSettingsData.rows = this.instances.map(
      (instance: SituationInstanceDefinition, index: number) => this.transformInstanceToRow(instance, index)
    );
  }

  public getInstances(): SituationInstanceDefinition[] {
    return this.instances;
  }
  private addNewInstance(instance: SituationInstanceDefinition): void {
    if (!instance) {
      return;
    }
    this.instances.push(instance);
    this.refreshTableSettingsData();
    this.isDirtyEmitter.emit(true);
  }

  private updateInstance(index: number, instance: SituationInstanceDefinition): void {
    if (!instance) {
      return;
    }
    this.instances[index] = instance;
    this.refreshTableSettingsData();
    this.isDirtyEmitter.emit(true);
  }

  private removeInstance(index: number): void {
    this.instances.splice(index, 1);
    this.refreshTableSettingsData();
    this.isDirtyEmitter.emit(true);
  }


  private insertHeaderInDataTable() {
    this.instanceTableSettingsData.header = [
      { text: 'settings.shared.attribute.id.label', classes: [SettingsTableElementClasses.COL_1] },
      { text: 'settings.shared.attribute.name.label', classes: [SettingsTableElementClasses.COL_4] },
      { text: '', classes: [SettingsTableElementClasses.COL] }
    ];
  }

  private transformInstanceToRow(instance: SituationInstanceDefinition, internalId: number): SettingsTableRow {
    return {
      objectId: internalId,
      click: this.displayInstanceEditionEmitter,
      rowElements: [
        {
          text: instance.id ? instance.id.toString() : '',
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: instance.name,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteInstanceEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }
}
