import { Injectable } from '@angular/core';
import { NetworkService } from '../../shared/services/network.service';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';
import { Observable } from 'rxjs';
import { Membership } from '../interfaces/membership';
import { Router } from '@angular/router';
import { ResourceService } from 'src/app/shared/services/resource.service';

@Injectable({
  providedIn: 'root'
})
export class SecurityGroupService extends ResourceService<SecurityGroup>  {

  constructor(
    private router: Router,
    public networkService: NetworkService
  ) {
    super(
      '/admin/security/groups',
      networkService
    );
  }

  public getMemberships(groupId: number): Observable<any> {
    return this.networkService.get(`${this.endpoint}/${groupId}/users`);
  }

  public putGroup(group: SecurityGroup) {
    this.update(group.id, group).toPromise();
    group.memberships.forEach((membership: Membership) => {
      this.putMembership(group.id, membership.id, membership.groupRole);
    });
  }

  private putMembership(groupId: number, userId: number, role: number) {
    this.networkService
      .put(`${this.endpoint}/${groupId}/users/${userId}`, { role })
      .toPromise();
  }

  public deleteMembership(groupId: number, userId: number) {
    this.networkService
      .delete(`${this.endpoint}/${groupId}/users/${userId}`)
      .toPromise();
  }

  public createGroup(group: SecurityGroup) {
    this.networkService.post(this.endpoint, group).subscribe(
      (res) => {
        group.memberships.forEach((membership: Membership) => {
          this.putMembership(res.id, membership.id, membership.groupRole);
        });
        this.router.navigate(['/administration/group-administration']);
      }
    );
  }
}
