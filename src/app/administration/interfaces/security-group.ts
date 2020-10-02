import { Membership } from 'src/app/administration/interfaces/membership';
import { Resource } from 'src/app/shared/models/resource';

export interface SecurityGroup extends Resource {
  name?: string;
  memberships?: Membership[];
}
