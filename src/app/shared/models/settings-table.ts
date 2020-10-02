import { EventEmitter } from '@angular/core';

export interface TableSettingsData {
  header: SettingsTableElementInHeader[];
  rows: SettingsTableRow[];
  ordered?: boolean;
  orderedEmitter?: EventEmitter<boolean>;
}

export interface SettingsTableElementInHeader {
  text: string;
  classes: SettingsTableElementClasses[];
  click?: EventEmitter<any>; // this field is actually not used, but opens the possibility to add a click event on header elements
}

export interface SettingsTableRow {
  rowElements: SettingsTableElementInRow[];
  objectId: number;
  click?: EventEmitter<number>;
}

export interface SettingsTableElementInRow {
  icon?: string;
  text?: string;
  click?: EventEmitter<number>;
  tooltip?: string;
  classes: SettingsTableElementClasses[];
}

export enum SettingsTableElementClasses {
  BOLD = 'bold',
  DELETE = 'delete',
  TEMPLATE_INDICATOR = 'is-template',
  ON_INDICATOR = 'on-indicator',
  OFF_INDICATOR = 'off-indicator',
  COL_1 = 'col-1',
  COL_2 = 'col-2',
  COL_3 = 'col-3',
  COL_4 = 'col-4',
  COL_5 = 'col-5',
  COL_6 = 'col-6',
  COL_7 = 'col-7',
  COL_8 = 'col-8',
  COL_9 = 'col-9',
  COL_10 = 'col-10',
  COL_11 = 'col-11',
  COL_12 = 'col-12',
  SIMPLE_USER = 'simple-user',
  CURSOR_HOVER = 'cursor-hover',
  COL = 'col'
}
