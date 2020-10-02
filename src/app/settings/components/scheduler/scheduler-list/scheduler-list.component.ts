import { Component, OnInit, EventEmitter } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { TranslateService } from '@ngx-translate/core';
import { SchedulerJob } from 'src/app/settings/interfaces/scheduler';
import { SchedulerService } from 'src/app/settings/services/scheduler.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Router } from '@angular/router';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';

@Component({
  selector: 'app-scheduler-list',
  templateUrl: './scheduler-list.component.html',
  styleUrls: ['./scheduler-list.component.scss']
})
export class SchedulerListComponent implements OnInit {

  public icons = Icons;
  private schedulers: SchedulerJob[];
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public deleteSchedulerEmitter: EventEmitter<number> = new EventEmitter();
  public displaySchedulerEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private translateService: TranslateService,
    private schedulerService: SchedulerService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.deleteSchedulerEmitter.subscribe((schedulerId: number): void => {
      this.deleteScheduler(schedulerId);
    });
    this.displaySchedulerEmitter.subscribe((schedulerId: number): void => {
      this.displayScheduler(schedulerId);
    });
    this.schedulerService.list().subscribe((schedulers: SchedulerJob[]) => {
      this.schedulers = schedulers;
      this.insertDataInTab(schedulers);
    });
  }

  public deleteScheduler(id: number) {
    this.translateService.get('settings.schedulers').subscribe((translations) => {
      this.dialog.open(ConfirmationPopUpComponent, {
        width: '30%',
        data: {
          title: 'settings.schedulerjob.component.deletewindow.title',
          content: 'settings.schedulerjob.component.deletewindow.message'
        }
      }).afterClosed().subscribe((validation: boolean) => {
        if (validation) {
          this.schedulerService.delete(id).subscribe(() => {
            this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
            this.snackBar.open(translations.schedulers.schedulerWasDeleted, null, { duration: 2000 });
          });
        }
      });
    });
  }

  public displayScheduler(id: number) {
    this.router.navigate(['/settings/schedulers', id]);
  }

  public searchScheduler(value: string) {
    this.tableSettingsData.rows = this.schedulers
      .filter((scheduler: SchedulerJob) => scheduler.id.toString().includes(value))
      .map((scheduler: SchedulerJob) => this.transformSchedulerToRow(scheduler));
  }

  private insertDataInTab(schedulers: SchedulerJob[]) {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1],
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3]
      },
      {
        text: 'settings.schedulerjob.attribute.cron.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.schedulerjob.attribute.jobtype.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
    this.tableSettingsData.rows = schedulers.map((scheduler: SchedulerJob) => this.transformSchedulerToRow(scheduler));
  }

  private transformSchedulerToRow(scheduler: SchedulerJob): SettingsTableRow {
    return {
      objectId: scheduler.id,
      click: this.displaySchedulerEmitter,
      rowElements: [
        {
          text: scheduler.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD],
        },
        {
          text: scheduler.name,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          text: scheduler.cronexpr,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: scheduler.jobtype,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteSchedulerEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

}
