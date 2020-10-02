import { Resource } from 'src/app/shared/models/resource';
import { SecurityGroup } from './security-group';

export interface User extends Resource {
  created?: string;
  email?: string;
  firstName?: string;
  name?: string;
  phone?: string;
  lastName?: string;
  role?: number;
  login?: string;
  groups?: SecurityGroup[];
  password?: string;
  permissions?: string[];
}
