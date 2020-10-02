import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ModelDefinition } from 'src/app/settings/interfaces/model';
import { ModelService } from 'src/app/settings/services/model.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Icons } from 'src/app/shared/constants/icons';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.scss']
})
export class ModelListComponent implements OnInit {

  public models: ModelDefinition[];
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public icons = Icons;
  public deleteModelEmitter: EventEmitter<number> = new EventEmitter();
  public displayModelEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private modelService: ModelService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.deleteModelEmitter.subscribe((modelId: number): void => {
      this.deleteModel(modelId);
    });
    this.displayModelEmitter.subscribe((modelId: number): void => {
      this.displayModel(modelId);
    });
    this.modelService.list().subscribe((models) => {
      this.models = models;
      this.insertDataInTab(models);
    });
  }

  public displayModel(id: number) {
    this.router.navigate(['/settings/models', id]);
  }

  public deleteModel(id: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.model.component.deletewindow.title',
        content: 'settings.model.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.modelService.delete(id).subscribe(() => {
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
        });
      }
    });
  }

  private insertDataInTab(models: ModelDefinition[]) {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3],
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
    this.tableSettingsData.rows = models.map((model: ModelDefinition) => this.transformModelToRow(model));
  }

  private transformModelToRow(model: ModelDefinition): SettingsTableRow {
    return {
      click: this.displayModelEmitter,
      objectId: model.id,
      rowElements: [
        {
          text: model.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: model.name,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteModelEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  public searchModel(value: string) {
    this.tableSettingsData.rows = this.models
      .filter((model: ModelDefinition) => model.name.includes(value))
      .map((model: ModelDefinition) => this.transformModelToRow(model));
  }
}
