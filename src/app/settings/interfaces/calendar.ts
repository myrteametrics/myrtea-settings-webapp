import { Resource } from 'src/app/shared/models/resource';

export interface CalendarDefinition extends Resource {
  name: string;
  description: string;
  periods?: CalendarDefinitionPeriod[];
  unionCalendarIDs?: number[];
  enabled: boolean;
}

export interface CalendarDefinitionPeriod {
  included: boolean;
  dateTimeIntervals?: CalendarDefinitionPeriodDateTimeIntervals;
  monthsOfYear?: CalendarDefinitionPeriodMonthsOfYear;
  daysOfMonth?: CalendarDefinitionPeriodDaysOfMonth;
  daysOfWeek?: CalendarDefinitionPeriodDaysOfWeek;
  hoursOfDay?: CalendarDefinitionPeriodHoursOfDay;
}

export interface CalendarDefinitionPeriodDateTimeIntervals {
  from: string;
  to: string;
}

export interface CalendarDefinitionPeriodMonthsOfYear {
  from: number;
  to: number;
}

export interface CalendarDefinitionPeriodDaysOfMonth {
  from: number;
  to: number;
}

export interface CalendarDefinitionPeriodDaysOfWeek {
  from: number;
  to: number;
}

export interface CalendarDefinitionPeriodHoursOfDay {
  fromHour: number;
  toHour: number;
  fromMinute: number;
  toMinute: number;
}
