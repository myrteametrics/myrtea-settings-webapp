import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { HeaderService } from 'src/app/header/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { FormBuilder, Validators } from '@angular/forms';
import { Icons } from '@shared/constants/icons';
import { CalendarCompositionComponent } from '../calendar-composition/calendar-composition.component';
import { MatDialog } from '@angular/material';
import { ConfirmationPopUpComponent } from '@shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { PeriodListComponent } from './period/period-list/period-list.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-calendar-edit',
  templateUrl: './calendar-edit.component.html',
  styleUrls: ['./calendar-edit.component.scss']
})
export class CalendarEditComponent implements OnInit, OnDestroy {

  @ViewChild('calendarComposition', { static: false }) calendarComposition: CalendarCompositionComponent;
  @ViewChild('periodList', { static: false }) periodList: PeriodListComponent;

  public icons = Icons;
  public creationMode: boolean;
  public isDirty = false;
  public calendar: CalendarDefinition;
  public calendarForm = this.formBuilder.group({
    id: [{ value: '', disabled: true }],
    name: ['', Validators.required],
    description: ['', Validators.required],
    enabled: [true, Validators.required]
  });

  constructor(
    private calendarService: CalendarService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.headerService.changeVisibility(false);
    this.creationMode = this.route.snapshot.data.creationMode;
    if (this.creationMode) {
      this.calendar = {
        unionCalendarIDs: [],
        name: '',
        periods: [],
        description: '',
        enabled: true
      };
    } else {
      this.route.params.subscribe((routeParams) => {
        this.fetchCalendar(routeParams.id).toPromise();
      });
    }
  }

  private fetchCalendar(id: number): Observable<boolean> {
    return new Observable((obesrver) => {
      this.calendarService.read(id).subscribe((calendar: CalendarDefinition) => {
        this.calendarForm.get('id').setValue(calendar.id);
        this.calendarForm.get('name').setValue(calendar.name);
        this.calendarForm.get('description').setValue(calendar.description);
        this.calendarForm.get('enabled').setValue(calendar.enabled);
        this.calendar = calendar;
        obesrver.next(true);
        obesrver.complete();
      });
    });
  }

  public calendarIsModifiedAndReady(): boolean {
    return this.calendarForm.valid && (this.calendarForm.dirty || this.isDirty);
  }

  public saveCalendar() {
    if (this.creationMode) {
      this.createCalendar();
      return;
    }
    this.updateCalendar();
  }

  private updateCalendar() {
    this.calendarService.update(this.calendar.id, {
      ...this.calendar,
      name: this.calendarForm.get('name').value,
      enabled: this.calendarForm.get('enabled').value,
      description: this.calendarForm.get('description').value,
      unionCalendarIDs: this.calendarComposition.getCalendarIds(),
      periods: this.periodList.getPeriodOrdered()
    }).subscribe(() => this.return());
  }

  public cancel() {
    if (this.creationMode) {
      this.return();
    } else {
      this.fetchCalendar(this.calendar.id).subscribe(() => {
        this.isDirty = false;
        this.calendarComposition.reset();
        this.periodList.reset(this.calendar.periods);
      });
    }
  }

  public deleteCalendar() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '40%',
      data: {
        title: 'settings.calendar.component.deletewindow.title',
        content: 'settings.calendar.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.calendarService.delete(this.calendar.id).subscribe(() => {
          this.return();
        });
      }
    });
  }

  private createCalendar() {
    this.calendarService.create({
      ...this.calendar,
      name: this.calendarForm.get('name').value,
      enabled: this.calendarForm.get('enabled').value,
      description: this.calendarForm.get('description').value,
      unionCalendarIDs: this.calendarComposition.getCalendarIds()
    }).subscribe(() => this.return());
  }

  public return(): void {
    this.router.navigate(['/settings/calendars']);
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

}
