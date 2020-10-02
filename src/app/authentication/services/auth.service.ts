import { Injectable, EventEmitter } from '@angular/core';
import { NetworkService } from 'src/app/shared/services/network.service';
import { Router } from '@angular/router';
import { User } from 'src/app/administration/interfaces/user';
import { Observable } from 'rxjs';
import { PermissionService } from '@shared/services/permission.service';
import { Permission } from '@shared/models/permission';
import { InternalRoutingService } from '@shared/services/internal-routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUser: User;
  private userInfosEmitter = new EventEmitter<void>();
  private storageToken = 'token';

  constructor(
    private networkService: NetworkService,
    private router: Router,
    private internalRoutingService: InternalRoutingService,
    private permissionService: PermissionService
  ) {
    if (localStorage.getItem(this.storageToken)) {
      this.fetchUserInfos();
    }
  }

  public login(username: string, password: string): void {
    this.networkService._post('/login', { login: username, password }).subscribe(res => {
      if (res.token) {
        localStorage.setItem(this.storageToken, res.token);
        this.fetchUserInfos();
        this.router.navigate([this.internalRoutingService.settingsPage]);
      }
    });
  }

  private fetchUserInfos(): void {
    this.networkService.get('/engine/security/myself').subscribe((user: User) => {
      user.permissions = this.permissionService.getPermissionsWithUserGroups(user.groups);
      this.currentUser = user;
      this.userInfosEmitter.emit();
    });
  }

  public userHasRight(permission: Permission): Observable<boolean> {
    return new Observable((observer) => {
      if (this.currentUser) {
        observer.next(this.userHasPermission(permission));
        observer.complete();
      } else {
        this.userInfosEmitter.subscribe(() => {
          observer.next(this.userHasPermission(permission));
          observer.complete();
        });
      }
    });
  }

  private userHasPermission(permission: Permission): boolean {
    const indexPermission = this.currentUser.permissions.findIndex((userPermission: string) => userPermission === permission);
    return indexPermission !== -1;
  }

  public logout(): void {
    localStorage.removeItem(this.storageToken);
    this.currentUser = undefined;
    this.router.navigate([this.internalRoutingService.loginPage]);
  }

  public isConnected(): boolean {
    return localStorage.getItem(this.storageToken) ? true : false;
  }
}
