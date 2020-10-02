import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  CalendarDefinitionPeriod, CalendarDefinitionPeriodDaysOfWeek,
  CalendarDefinitionPeriodMonthsOfYear, CalendarDefinitionPeriodDateTimeIntervals
} from 'src/app/settings/interfaces/calendar';
import { TableSettingsData, SettingsTableElementClasses, SettingsTableRow } from '@shared/models/settings-table';
import { Icons } from '@shared/constants/icons';
import { MatDialog } from '@angular/material';
import { PeriodEditComponent } from '../period-edit/period-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { Days } from '@shared/constants/day';
import { Months } from '@shared/constants/month';
import * as moment from 'node_modules/moment';

@Component({
  selector: 'app-period-list',
  templateUrl: './period-list.component.html',
  styleUrls: ['./period-list.component.scss']
})
export class PeriodListComponent implements OnInit {

  @Input() periods: CalendarDefinitionPeriod[];
  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  public icons = Icons;
  public periodTableSettingsData: TableSettingsData = {
    header: [],
    rows: [],
    ordered: true,
    orderedEmitter: this.isDirtyEmitter
  };
  public deletePeriodEmitter: EventEmitter<number> = new EventEmitter();
  public displayPeriodEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private translateService: TranslateService
  ) { }

  ngOnInit() {
    this.setHeaderTableSettingsData();
    this.insertDataTableSettingsData(this.periods);
    this.displayPeriodEmitter.subscribe((index: number) => this.displayPeriodEdit(index));
    this.deletePeriodEmitter.subscribe((index: number) => this.removePeriod(index));
  }

  public reset(periods: CalendarDefinitionPeriod[]) {
    this.insertDataTableSettingsData(periods);
  }

  public getPeriodOrdered(): CalendarDefinitionPeriod[] {
    const periods = [];
    this.periodTableSettingsData.rows.forEach((row: SettingsTableRow) => {
      periods.push(this.periods[row.objectId]);
    });
    return periods;
  }

  private removePeriod(index: number) {
    this.periods = this.periods.filter(
      (period: CalendarDefinitionPeriod, indexInList: number) => index !== indexInList
    );
    this.isDirtyEmitter.emit(true);
    this.insertDataTableSettingsData(this.periods);
  }

  public displayPeriodEdit(index = -1) {
    this.dialog.open(PeriodEditComponent, {
      width: '50%',
      data: {
        period: index === -1 ? {} : this.periods[index],
        creationMode: index === -1 ? true : false
      }
    }).afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.isDirtyEmitter.emit(true);
      if (index !== -1) {
        this.periods[index] = res.period;
        this.insertDataTableSettingsData(this.periods);
        return;
      }
      this.periods.push(res.period);
      this.insertDataTableSettingsData(this.periods);
    });
  }

  private getDaysOfWeekTranslation(days: CalendarDefinitionPeriodDaysOfWeek): string {
    const dayFrom = Days.find((day) => day.value === days.from);
    const dayTo = Days.find((day) => day.value === days.to);
    return `${this.translateService.instant(dayFrom.translationKey)} - ${this.translateService.instant(dayTo.translationKey)}`;
  }

  private getMonthsOfYearTranslation(months: CalendarDefinitionPeriodMonthsOfYear): string {
    const monthFrom = Months.find((month) => month.value === months.from);
    const monthTo = Months.find((month) => month.value === months.to);
    return `${this.translateService.instant(monthFrom.translationKey)} - ${this.translateService.instant(monthTo.translationKey)}`;
  }

  private getDateTimeIntervalsFormated(date: CalendarDefinitionPeriodDateTimeIntervals): string {
    const dateFrom = moment(date.from).format('DD/MM');
    const dateTo = moment(date.to).format('DD/MM');
    return `${dateFrom} - ${dateTo}`;
  }

  private transformPeriodToRow(period: CalendarDefinitionPeriod, index: number): SettingsTableRow {
    return {
      objectId: index,
      click: this.displayPeriodEmitter,
      rowElements: [
        {
          text: period.included ? 'Include' : 'Exclude',
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: period.dateTimeIntervals ? this.getDateTimeIntervalsFormated(period.dateTimeIntervals) : '-',
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: period.monthsOfYear ? this.getMonthsOfYearTranslation(period.monthsOfYear) : '-',
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: period.daysOfMonth ? `${period.daysOfMonth.from} - ${period.daysOfMonth.to} ` : '-',
          classes: [SettingsTableElementClasses.COL_1]
        },
        {
          text: period.daysOfWeek ? this.getDaysOfWeekTranslation(period.daysOfWeek) : '-',
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: period.hoursOfDay ?
            `${period.hoursOfDay.fromHour}: ${period.hoursOfDay.fromMinute} - ${period.hoursOfDay.toHour}: ${period.hoursOfDay.toMinute} ` :
            '-',
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          icon: this.icons.TRASH.name,
          click: this.deletePeriodEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  private insertDataTableSettingsData(periods: CalendarDefinitionPeriod[]) {
    this.periodTableSettingsData.rows = periods.map((period: CalendarDefinitionPeriod, index: number) => {
      return this.transformPeriodToRow(period, index);
    });
  }

  private setHeaderTableSettingsData() {
    this.periodTableSettingsData.header = [
      {
        text: 'settings.calendarperiod.attribute.includeexclude.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.calendarperiod.attribute.date.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.calendarperiod.attribute.month.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.calendarperiod.attribute.day.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.calendarperiod.attribute.dayofaweek.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.calendarperiod.attribute.hoursofaday.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

}
