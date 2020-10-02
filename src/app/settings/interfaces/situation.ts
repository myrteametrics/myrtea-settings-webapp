import { Resource } from '../../shared/models/resource';
import { CalendarDefinition } from 'src/app/settings/interfaces/calendar';

export interface SituationDefinition extends Resource {
  name: string;
  description?: string;
  calendarId?: number;
  parameters?: SituationParameters;
  expressionFacts?: SituationExpressionFact[];
  isTemplate: boolean;
  groups?: number[];
  facts?: number[];
}

export interface SituationInstanceDefinition extends Resource {
  name: string;
  calendarId?: number;
  parameters?: SituationParameters;
}
export interface SituationExpressionFact {
  name: string;
  expression: string;
}

export interface SituationParameters {
  [key: string]: any;
}

export interface SituationInstanceEditData {
  creationMode: boolean;
  instance: SituationInstanceDefinition;
  calendars: CalendarDefinition[];
}
