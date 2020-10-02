import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarDefinitionPeriod } from 'src/app/settings/interfaces/calendar';
import { FormBuilder, Validators } from '@angular/forms';
import { Icons } from '@shared/constants/icons';
import { Months } from '@shared/constants/month';
import { Days } from '@shared/constants/day';
import * as moment from 'node_modules/moment';

interface PeriodEditData {
  period?: CalendarDefinitionPeriod;
  creationMode?: boolean;
}

@Component({
  selector: 'app-period-edit',
  templateUrl: './period-edit.component.html',
  styleUrls: ['./period-edit.component.scss']
})
export class PeriodEditComponent implements OnInit {

  public icons = Icons;
  public months = Months;
  public days = Days;
  public creationMode: boolean;
  public periodForm = this.formBuilder.group({
    included: [true, Validators.required],
    monthsOfYearFrom: [undefined],
    monthsOfYearTo: [undefined],
    daysOfMonthFrom: [undefined],
    daysOfMonthTo: [undefined],
    daysOfWeekFrom: [undefined],
    daysOfWeekTo: [undefined],
    hoursOfDayFrom: [undefined],
    hoursOfDayTo: [undefined],
    minutesOfDayFrom: [undefined],
    minutesOfDayTo: [undefined],
    dateTimeIntervalsFrom: [undefined],
    dateTimeIntervalsTo: [undefined]
  });

  constructor(
    public dialogRef: MatDialogRef<PeriodEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PeriodEditData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.creationMode = this.data.creationMode;
    if (!this.creationMode) {
      this.insertPeriodInForm(this.data.period);
    }
  }

  public insertPeriodInForm(period: CalendarDefinitionPeriod) {
    this.periodForm.get('included').setValue(period.included);
    if (period.monthsOfYear) {
      this.periodForm.get('monthsOfYearFrom').setValue(period.monthsOfYear.from);
      this.periodForm.get('monthsOfYearTo').setValue(period.monthsOfYear.to);
    }
    if (period.daysOfMonth) {
      this.periodForm.get('daysOfMonthTo').setValue(period.daysOfMonth.to);
      this.periodForm.get('daysOfMonthFrom').setValue(period.daysOfMonth.from);
    }
    if (period.daysOfWeek) {
      this.periodForm.get('daysOfWeekTo').setValue(period.daysOfWeek.to);
      this.periodForm.get('daysOfWeekFrom').setValue(period.daysOfWeek.from);
    }
    if (period.hoursOfDay) {
      this.periodForm.get('hoursOfDayFrom').setValue(period.hoursOfDay.fromHour);
      this.periodForm.get('hoursOfDayTo').setValue(period.hoursOfDay.toHour);
      this.periodForm.get('minutesOfDayFrom').setValue(period.hoursOfDay.fromMinute);
      this.periodForm.get('minutesOfDayTo').setValue(period.hoursOfDay.toMinute);
    }
    if (period.dateTimeIntervals) {
      this.periodForm.get('dateTimeIntervalsFrom').setValue(period.dateTimeIntervals.from);
      this.periodForm.get('dateTimeIntervalsTo').setValue(period.dateTimeIntervals.to);
    }
  }

  private dateTimeIntervalsIsValid(): boolean {
    if (
      this.periodForm.get('dateTimeIntervalsFrom').value &&
      this.periodForm.get('dateTimeIntervalsTo').value
    ) {
      return true;
    }
    return false;
  }

  private hoursOfDayIsValid(): boolean {
    if (
      this.periodForm.get('hoursOfDayFrom').value &&
      this.periodForm.get('hoursOfDayTo').value &&
      this.periodForm.get('minutesOfDayFrom').value &&
      this.periodForm.get('minutesOfDayTo').value) {
      return true;
    }
    return false;
  }

  private monthsOfYearIsValid(): boolean {
    if (this.periodForm.get('monthsOfYearFrom').value && this.periodForm.get('monthsOfYearTo').value) {
      return true;
    }
    return false;
  }


  private daysOfWeekIsValid(): boolean {
    if (this.periodForm.get('daysOfWeekFrom').value && this.periodForm.get('daysOfWeekTo').value) {
      return true;
    }
    return false;
  }

  private daysOfMonthIsValid(): boolean {
    if (this.periodForm.get('daysOfMonthTo').value && this.periodForm.get('daysOfMonthFrom').value) {
      return true;
    }
    return false;
  }

  public closeDialog() {
    this.dialogRef.close();
  }

  public formIsValid(): boolean {
    const atLeastOnePeriod =
      this.hoursOfDayIsValid() || this.monthsOfYearIsValid() || this.daysOfMonthIsValid() || this.daysOfWeekIsValid()
      || this.dateTimeIntervalsIsValid();
    return !!this.periodForm && this.periodForm.dirty && this.periodForm.valid && atLeastOnePeriod;
  }

  public confirm() {
    const period: CalendarDefinitionPeriod = {
      included: this.periodForm.get('included').value,
      monthsOfYear: !this.monthsOfYearIsValid() ? undefined :
        {
          from: Number(this.periodForm.get('monthsOfYearFrom').value),
          to: Number(this.periodForm.get('monthsOfYearTo').value)
        },
      daysOfWeek: !this.daysOfWeekIsValid() ? undefined :
        {
          from: Number(this.periodForm.get('daysOfWeekFrom').value),
          to: Number(this.periodForm.get('daysOfWeekTo').value)
        },
      daysOfMonth: !this.daysOfMonthIsValid() ? undefined :
        {
          from: this.periodForm.get('daysOfMonthFrom').value,
          to: this.periodForm.get('daysOfMonthTo').value
        },
      hoursOfDay: !this.hoursOfDayIsValid() ? undefined :
        {
          fromHour: this.periodForm.get('hoursOfDayFrom').value,
          toHour: this.periodForm.get('hoursOfDayTo').value,
          fromMinute: this.periodForm.get('minutesOfDayFrom').value,
          toMinute: this.periodForm.get('minutesOfDayTo').value
        },
      dateTimeIntervals: !this.dateTimeIntervalsIsValid() ? undefined :
        {
          from: moment(this.periodForm.get('dateTimeIntervalsFrom').value).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          to: moment(this.periodForm.get('dateTimeIntervalsTo').value).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
        }
    };
    this.dialogRef.close({ period });
  }

}
