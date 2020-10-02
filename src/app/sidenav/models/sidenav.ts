import { Permission } from '@shared/models/permission';

export interface SidenavTab {
  iconName: string;
  iconTooltip: string;
  link: string;
  prefix: string;
  permission: Permission;
}
