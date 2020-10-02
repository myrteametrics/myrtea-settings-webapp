import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Observable } from 'rxjs';
import { Permission } from '@shared/models/permission';
import { InternalRoutingService } from '@shared/services/internal-routing.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(
    private router: Router,
    private internalRoutingService: InternalRoutingService,
    private authService: AuthService
  ) { }

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const permission: Permission = route.data.permission;
    const hasRight = this.authService.userHasRight(permission);
    hasRight.subscribe((right: boolean) => {
      if (!right) {
        this.router.navigate([this.internalRoutingService.forbiddenPage]);
      }
    });
    return hasRight;
  }
}
