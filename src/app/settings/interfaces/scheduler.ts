import { Resource } from 'src/app/shared/models/resource';

export interface SchedulerJob extends Resource {
  name?: string;
  cronexpr?: string;
  jobtype?: SchedulerJobType;
  job?: SchedulerJobFact | SchedulerJobBaseline;
}

export interface SchedulerJobFact {
  factIds: number[];
  from?: string;
  to?: string;
}

export interface SchedulerJobBaseline {
  baselineIds: number[];
}

export enum SchedulerJobType {
  Fact = 'fact',
  Baseline = 'baseline'
}
