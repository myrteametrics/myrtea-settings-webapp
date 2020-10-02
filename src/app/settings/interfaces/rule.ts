import { Resource } from 'src/app/shared/models/resource';

export interface Rule extends Resource {
  name?: string;
  description?: string;
  enabled?: boolean;
  parameters?: RuleParameters;
  cases?: RuleCase[];
  version?: number;
  calendarId?: number;
}

export interface RuleParameters {
  [key: string]: any;
}

export interface RuleCase {
  name?: string;
  condition?: string;
  tasks?: Task[];
  index?: number;
  actions?: any[];
}

export interface Action {
  name?: string;
  parameters: any;
}

export interface Task {
  index?: number;
  type?: InternTaskType | ExternTaskType;
  task?: {
    id?: string;
    level?: TaskLevel;
    timeout?: string;
    isNotification?: boolean;
    key?: string;
    value?: string;
    name?: string;
    description?: string;
    timeZone?: string;
  };
}

export enum TaskLevel {
  INFO = 'info',
  OK = 'ok',
  CRITIQUE = 'critical',
  WARNING = 'warning'
}

export enum InternTaskType {
  SET = 'set'
}

export enum ExternTaskType {
  NOTIFY = 'notify',
  CREATEISSUE = 'issue',
  CLOSETODAYISSUES = 'closeTodayIssues'
}
