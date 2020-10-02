import { Resource } from 'src/app/shared/models/resource';

export interface FactHistory {
  id: number;
  type: 'not_supported' | 'single';
  deepness: number;
  currentValue: FactDefinition;
  history: FactDefinition[];
}

export interface Intent {
  name?: string;
  operator?: string;
  term?: string;
}

export interface FactDefinitions {
  [id: number]: FactDefinition;
}

export interface FactDefinition extends Resource {
  name: string;
  model: string;
  calculationDepth: number;
  isTemplate: boolean;
  variables?: string[]; // FIXME: remove after backend fix (and use "parameters" instead)
  // parameters?: string[];
  intent: FactIntent;
  dimensions?: FactDimension[];
  condition?: (FactConditionGroup | FactConditionLeaf);
  isObject: boolean;
  advancedSource?: string;
}

export interface FactIntent {
  name?: string;
  operator?: FactIntentOperator;
  term?: string;
}

export interface FactDimension {
  name: string;
  operator: FactDimensionOperator;
  term: string;
  size?: number;
  interval?: number;
  dateinterval?: string;
}

export interface FactConditionGroup {
  operator: FactConditionGroupOperator | '';
  expression?: string;
  fragments: (FactConditionGroup | FactConditionLeaf)[];
}

export interface FactConditionLeaf {
  operator: FactConditionLeafOperator | '';
  term?: string;
  value?: string;
  value2?: string;
}

export enum FactIntentOperator {
  Count = 'count',
  Sum = 'sum',
  Avg = 'avg',
  Min = 'min',
  Max = 'max',
  Select = 'select'
}

export enum FactDimensionOperator {
  By = 'by',
  Histogram = 'histogram',
  Datehistogram = 'datehistogram'
}

export const FactDimensionOptions = {
  By: 'size',
  Histogram: 'interval',
  Datehistogram: 'dateinterval'
};

export enum FactConditionGroupOperator {
  And = 'and',
  Or = 'or',
  Not = 'not',
  If = 'if'
}

export enum FactConditionLeafOperator {
  Exists = 'exists',
  For = 'for',
  From = 'from',
  To = 'to',
  Between = 'between',
  Script = 'script'
}
