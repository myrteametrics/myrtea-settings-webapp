import { Component, OnInit, EventEmitter } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { RootCausesService } from 'src/app/settings/services/root-causes.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Router } from '@angular/router';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';
import { RootCause } from 'src/app/settings/interfaces/root-cause';


@Component({
  selector: 'app-root-causes-list',
  templateUrl: './root-causes-list.component.html',
  styleUrls: ['./root-causes-list.component.scss']
})
export class RootCausesListComponent implements OnInit {

  public icons = Icons;
  private rootCauses: RootCause[];
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  deleteRCEmitter: EventEmitter<number> = new EventEmitter();
  displayRCEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private rootCausesService: RootCausesService,
    private translateService: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.deleteRCEmitter.subscribe((rcId: number): void => {
      this.deleteRootCause(rcId);
    });
    this.displayRCEmitter.subscribe((rcId: number): void => {
      this.displayRootCause(rcId);
    });
    this.rootCausesService.list().subscribe((rootCauses: RootCause[]) => {
      this.rootCauses = rootCauses;
      this.insertDataInTab(rootCauses);
    });
  }

  public displayRootCause(id: number) {
    // this.router.navigate(['/settings/root-causes-action', id]);
  }

  public deleteRootCause(id: number) {
    this.translateService.get('settings.rootCauses').subscribe((translations) => {
      const rootCauseToDelete: RootCause = this.rootCauses.find((rootCause: RootCause) => rootCause.id === id);
      this.dialog.open(ConfirmationPopUpComponent, {
        width: '30%',
        data: {
          title: `${translations.deleteRootCauses} ${rootCauseToDelete.name}`,
          content: translations.deleteRootCausesConfirmationMessage
        }
      }).afterClosed().subscribe((validation: boolean) => {
        if (validation) {
          this.rootCausesService.delete(id).subscribe(() => {
            this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
          });
        }
      });
    });
  }

  public searchRootCauses(value: string) {
    this.tableSettingsData.rows = this.rootCauses
      .filter((rootCause: RootCause) => rootCause.name.includes(value))
      .map((rootCause: RootCause) => this.transforRootCauseToRow(rootCause));
  }

  private insertDataInTab(rootCauses: RootCause[]) {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_2],
      },
      {
        text: 'settings.shared.attribute.description.label',
        classes: [SettingsTableElementClasses.COL_2],
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL_1]
      }
    ];
    this.tableSettingsData.rows = rootCauses.map((rootCause: RootCause) => this.transforRootCauseToRow(rootCause));
  }

  private transforRootCauseToRow(rootCause: RootCause): SettingsTableRow {
    return {
      click: this.displayRCEmitter,
      objectId: rootCause.id,
      rowElements: [
        {
          text: rootCause.name,
          classes: [SettingsTableElementClasses.BOLD, SettingsTableElementClasses.COL_2],
        },
        {
          text: rootCause.description,
          classes: [SettingsTableElementClasses.COL_2],
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteRCEmitter,
          classes: [SettingsTableElementClasses.DELETE, SettingsTableElementClasses.COL_1]
        }
      ]
    };
  }

}
