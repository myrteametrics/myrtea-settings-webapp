import { Resource } from '../../shared/models/resource';

export interface RootCause extends Resource {
  name?: string;
  description?: string;
  situationid?: number;
  ruleId?: number;
}
