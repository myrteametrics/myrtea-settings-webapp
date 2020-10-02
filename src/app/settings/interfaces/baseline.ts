import { Resource } from 'src/app/shared/models/resource';

export interface BaselineDefinition extends Resource {
  factId: number;
  factName: string;
  name: string;
  dayOfWeek: boolean;
  startOffset: string;
  step: string;
  historyDepth: string;
}
