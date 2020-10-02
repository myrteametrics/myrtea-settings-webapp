import { Component, OnInit, EventEmitter } from '@angular/core';
import { Icons } from '@shared/constants/icons';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from '@shared/models/settings-table';
import { MatDialog } from '@angular/material';
import { ConfirmationPopUpComponent } from '@shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.scss']
})
export class CalendarListComponent implements OnInit {

  public icons = Icons;
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  private calendars: CalendarDefinition[];
  public deleteCalendarEmitter: EventEmitter<number> = new EventEmitter();
  public displayCalendarEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.deleteCalendarEmitter.subscribe((id: number) => this.deleteCalender(id));
    this.displayCalendarEmitter.subscribe((id: number) => {
      this.router.navigate(['/settings/calendars', id]);
    });
    this.calendarService.list().subscribe((calendars: CalendarDefinition[]) => {
      this.calendars = calendars;
      this.insertDataInTab(this.calendars);
    });
  }

  private insertDataInTab(calendars: CalendarDefinition[]) {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.shared.attribute.description.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.calendar.attribute.enabled.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
    this.tableSettingsData.rows = calendars.map((calendar: CalendarDefinition) => this.transformCalendarToRow(calendar));
  }

  private transformCalendarToRow(calendar: CalendarDefinition): SettingsTableRow {
    return {
      objectId: calendar.id,
      click: this.displayCalendarEmitter,
      rowElements: [
        {
          text: calendar.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: calendar.name,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: calendar.description,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: calendar.enabled ? 'On' : 'Off',
          classes: calendar.enabled ? [SettingsTableElementClasses.ON_INDICATOR] : [SettingsTableElementClasses.OFF_INDICATOR]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteCalendarEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  private deleteCalender(id: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '40%',
      data: {
        title: 'settings.calendar.component.deletewindow.title',
        content: 'settings.calendar.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.calendarService.delete(id).subscribe(() => {
          this.calendars = this.calendars.filter((calendar: CalendarDefinition) => calendar.id !== id);
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter((row: SettingsTableRow) => row.objectId !== id);
        });
      }
    });
  }

  public searchCalendar(value: string) {
    this.tableSettingsData.rows = this.calendars
      .filter((calendar: CalendarDefinition) => calendar.name.includes(value))
      .map((calendar: CalendarDefinition) => this.transformCalendarToRow(calendar));
  }

}
