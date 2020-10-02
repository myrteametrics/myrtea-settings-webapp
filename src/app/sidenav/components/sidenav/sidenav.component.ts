import { Component, OnInit, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ImagesPaths } from '../../../shared/constants/images-path';
import { Icons } from 'src/app/shared/constants/icons';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { SidenavTab } from '../../models/sidenav';
import { SidenavService } from '../../services/sidenav.service';
import { MyrteaPermission } from '@shared/models/permission';
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {

  public imagesPaths = ImagesPaths;
  public icons = Icons;
  public sidenavTabs: SidenavTab[] = [];

  constructor(
    public router: Router,
    private authService: AuthService,
    private sidenavService: SidenavService
  ) {
    this.sidenavTabs = this.sidenavService.tabs;
  }

  ngOnInit() { }

  public onLogout() {
    this.authService.logout();
  }

  public isSelected(prefix: string): boolean {
    return this.router.url.includes(prefix);
  }

}
