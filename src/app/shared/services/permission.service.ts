import { Injectable } from '@angular/core';
import { Permission, MyrteaPermission } from '@shared/models/permission';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  private SecurityGroupPermissions: { [key: string]: Permission[] } = {
    USER: [
      MyrteaPermission.viewHome,
      MyrteaPermission.viewUserSettings
    ],
    ADMIN: [
      MyrteaPermission.viewSettings,
      MyrteaPermission.viewAdministration,
      MyrteaPermission.viewUserSettings
    ]
  };

  constructor() { }

  public getPermissionsWithUserGroups(groups: SecurityGroup[]): Permission[] {
    let permissions: Permission[] = [];
    groups.forEach((group: SecurityGroup) => {
      if (this.SecurityGroupPermissions[group.name]) {
        permissions = permissions.concat(this.SecurityGroupPermissions[group.name]);
      }
    });
    return permissions;
  }

  public removeGroup(groupName: string): void {
    delete this.SecurityGroupPermissions[groupName];
  }

  public addGroup(groupName: string, permissions: Permission[] = []): void {
    this.SecurityGroupPermissions = {
      ... this.SecurityGroupPermissions,
      [groupName]: permissions
    };
  }

  public addPermissions(groupName: string, permissions: Permission[]): void {
    this.SecurityGroupPermissions = {
      ... this.SecurityGroupPermissions,
      [groupName]: this.SecurityGroupPermissions[groupName].concat(permissions)
    };
  }

  public removePermissions(groupName: string, permissions: Permission[]): void {
    permissions.forEach((permissionToRemove: Permission) => {
      this.removePermission(groupName, permissionToRemove);
    });
  }

  public replacePermissions(groupName: string, permissions: Permission[]): void {
    this.SecurityGroupPermissions = {
      ... this.SecurityGroupPermissions,
      [groupName]: permissions
    };
  }

  private removePermission(groupName: string, permission: Permission): void {
    let permissionsToModify: Permission[] = this.SecurityGroupPermissions[groupName];
    permissionsToModify = permissionsToModify.filter((groupPermission: Permission) => {
      return groupPermission !== permission;
    });
    this.SecurityGroupPermissions = {
      ... this.SecurityGroupPermissions,
      [groupName]: permissionsToModify
    };
  }

}
