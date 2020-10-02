import { Component, EventEmitter, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SituationDefinition } from 'src/app/settings/interfaces/situation';
import { SituationService } from 'src/app/settings/services/situation.service';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Icons } from 'src/app/shared/constants/icons';
import { SettingsTableRow, TableSettingsData, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';

@Component({
  selector: 'app-situation-list',
  templateUrl: './situation-list.component.html',
  styleUrls: ['./situation-list.component.scss']
})
export class SituationListComponent implements OnInit {

  private situations: SituationDefinition[];
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public icons = Icons;
  private deleteSituationEmitter: EventEmitter<number> = new EventEmitter();
  private displaySituationEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private situationService: SituationService,
    private translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.situationService.list().subscribe((situations: SituationDefinition[]) => {
      this.situations = situations;
      this.insertDataInTab(this.situations);
    });
    this.deleteSituationEmitter.subscribe((situationId: number) => this.deleteSituation(situationId));
    this.displaySituationEmitter.subscribe((situationId: number) => this.displaySituation(situationId));
  }

  public displaySituation(id: number) {
    this.router.navigate(['/settings/situations', id]);
  }

  public searchSituation(value: string) {
    this.tableSettingsData.rows = this.situations
      .filter((situation: SituationDefinition) => situation.name.includes(value))
      .map((situation: SituationDefinition) => this.transformSituationToRow(situation));
  }

  public deleteSituation(id: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.situation.component.deletewindow.title',
        content: 'settings.situation.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.situationService.delete(id).subscribe(() => {
          const message = 'MISSING';
          this.snackBar.open(message, null, { duration: 2000 });
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
        });
      }
    });
  }

  private insertDataInTab(situations: SituationDefinition[]) {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3],
      },
      {
        text: 'settings.situation.attribute.istemplate.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
    this.tableSettingsData.rows = situations.map((situation: SituationDefinition) => this.transformSituationToRow(situation));
  }

  private transformSituationToRow(situation: SituationDefinition): SettingsTableRow {
    return {
      objectId: situation.id,
      click: this.displaySituationEmitter,
      rowElements: [
        {
          text: situation.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: situation.name,
          classes: [SettingsTableElementClasses.COL_3],
        },
        {
          text: situation.isTemplate ? 'Template' : '',
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.TEMPLATE_INDICATOR]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteSituationEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

}
