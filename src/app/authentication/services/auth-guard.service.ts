import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { InternalRoutingService } from '@shared/services/internal-routing.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private internalRoutingService: InternalRoutingService,
    private authService: AuthService
  ) { }

  public canActivate(): boolean {
    if (this.authService.isConnected()) {
      return true;
    }
    this.router.navigate([this.internalRoutingService.loginPage]);
    return false;
  }
}
