import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CalendarService } from 'src/app/settings/services/calendar.service';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';
import { TableSettingsData, SettingsTableElementClasses, SettingsTableRow } from '@shared/models/settings-table';
import { Icons } from '@shared/constants/icons';
import { InputWithSuggestionsData, InputWithSuggestionsElement } from '@shared/models/input-with-suggestions';
import { MatDialog } from '@angular/material';
import { MultipleSelectionPopUpComponent } from '@shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from '@shared/models/multiple-selection';

@Component({
  selector: 'app-calendar-composition',
  templateUrl: './calendar-composition.component.html',
  styleUrls: ['./calendar-composition.component.scss']
})
export class CalendarCompositionComponent implements OnInit {

  @Input() calendarIds: number[];
  @Input() currentCalendarId: number;
  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  public calendars: CalendarDefinition[];
  public icons = Icons;
  public calendarsInComposition: CalendarDefinition[] = [];
  public calendarsTableSettingsData: TableSettingsData = {
    header: [],
    rows: [],
    ordered: true,
    orderedEmitter: this.isDirtyEmitter
  };
  public deleteCalendarEmitter: EventEmitter<number> = new EventEmitter();
  public calendarWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.calendar.component.addelement.add',
    elements: []
  };

  constructor(
    private calendarService: CalendarService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchCalendars();
    this.deleteCalendarEmitter.subscribe((calendarId: number) => this.removeCalendarInComposition(calendarId));
  }

  public displayMultipleCalendarSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '60%',
      height: '60vh',
      data: {
        title: 'settings.calendar.component.addelement.add',
        search: 'settings.calendar.component.addelement.search',
        selected: 'settings.calendar.component.addelement.selected',
        elements: this.calendars
          .filter((calendar: CalendarDefinition) => !this.calendarIsInComposition(calendar))
          .map((calendar: CalendarDefinition): MultipleSelectionElement => {
            return {
              name: calendar.name,
              id: calendar.id
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addCalendar(element.id));
    });
  }

  private insertCalendarInSuggestions() {
    this.calendarWithSuggestions.elements = this.calendars
      .filter((calendar: CalendarDefinition) => !this.calendarIsInComposition(calendar))
      .map((calendar: CalendarDefinition) => this.transformCalendarToSuggestion(calendar));
  }

  private transformCalendarToSuggestion(calendar: CalendarDefinition): InputWithSuggestionsElement {
    return {
      objectId: calendar.id,
      content: calendar.name
    };
  }

  private calendarIsInComposition(calendar: CalendarDefinition): boolean {
    if (calendar.id === this.currentCalendarId) {
      return true;
    }
    const calendarIndex = this.calendarsInComposition.findIndex((calendarInComposition: CalendarDefinition) => {
      return calendarInComposition.id === calendar.id;
    });
    return calendarIndex !== -1;
  }

  private removeCalendarInComposition(calendarId: number) {
    this.calendarsInComposition = this.calendarsInComposition.filter((calendar: CalendarDefinition) => {
      return calendar.id !== calendarId;
    });
    this.isDirtyEmitter.emit(true);
    this.insertDataInTab(this.calendarsInComposition);
  }

  private insertDataInTab(calendars: CalendarDefinition[]) {
    this.calendarsTableSettingsData.header = [
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
    this.calendarsTableSettingsData.rows = calendars.map((calendar: CalendarDefinition) => this.transformCalendarToRow(calendar));
    this.insertCalendarInSuggestions();
  }

  private transformCalendarToRow(calendar: CalendarDefinition): SettingsTableRow {
    return {
      objectId: calendar.id,
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

  private fetchCalendars() {
    this.calendarService.list().subscribe((calendars: CalendarDefinition[]) => {
      this.calendars = calendars;
      if (this.calendarIds) {
        this.addCalendarsInComposition();
      } else {
        this.insertDataInTab(this.calendarsInComposition);
      }
    });
  }

  private addCalendarsInComposition() {
    this.calendarIds.forEach((id: number) => {
      const calendarToAdd: CalendarDefinition = this.calendars.find((calendar: CalendarDefinition) => {
        return calendar.id === id;
      });
      this.calendarsInComposition.push(calendarToAdd);
    });
    this.insertDataInTab(this.calendarsInComposition);
  }

  public addCalendar(calendarId: number) {
    const calendarToAdd: CalendarDefinition = this.calendars.find((calendar: CalendarDefinition) => {
      return calendarId === calendar.id;
    });
    this.calendarsInComposition.push(calendarToAdd);
    this.isDirtyEmitter.emit(true);
    this.insertDataInTab(this.calendarsInComposition);
  }

  public getCalendarIds(): number[] {
    const calendarIds: number[] = [];
    this.calendarsTableSettingsData.rows.forEach((row: SettingsTableRow) => {
      calendarIds.push(row.objectId);
    });
    return calendarIds;
  }

  public reset() {
    this.calendarsInComposition = [];
    this.fetchCalendars();
  }

}
