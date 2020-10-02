import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { appTitle } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { RouterModule } from '@angular/router';
import { SidenavModule } from './sidenav/sidenav.module';
import { ErrorInterceptor } from '@shared/interceptors/errorInterceptor';
import { AdministrationModule } from './administration/administration.module';
import { SettingsModule } from './settings/settings.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { multiTranslateLoader } from 'src/app/app.translateloader';
import { UserSettingsService } from './settings/services/user-settings.service';
import { IconsService } from './shared/services/icons.service';
import { AuthInterceptor } from '@shared/interceptors/authInterceptor';
import { MyrteaPermission } from '@shared/models/permission';
import { SidenavService } from 'src/app/sidenav/services/sidenav.service';
import { PermissionService } from '@shared/services/permission.service';
import { Icons } from '@shared/constants/icons';
import { ContainerComponent } from '@shared/components/container/container.component';
import { HeaderBarComponent } from './header/components/header-bar/header-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    ContainerComponent,
    HeaderBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: multiTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthenticationModule,
    SettingsModule,
    SidenavModule,
    RouterModule,
    AuthenticationModule,
    AdministrationModule,
    SettingsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    public userSettingsService: UserSettingsService,
    public titleService: Title,
    public iconsService: IconsService,
    private sidenavService: SidenavService,
    private permissionService: PermissionService
  ) {
    this.permissionService.addGroup('administrators', [
      MyrteaPermission.viewHome,
      MyrteaPermission.viewUserSettings,
      MyrteaPermission.viewAdministration,
      MyrteaPermission.viewSettings,
    ]);
    this.titleService.setTitle(appTitle);
    this.iconsService.setIconsRegistry();
    if (this.sidenavService.tabs.length === 0) {
      this.sidenavService.addTab({
        prefix: '/settings',
        link: '/settings',
        iconName: Icons.SETTINGS.name,
        iconTooltip: 'sidenav.settings.tooltip',
        permission: MyrteaPermission.viewSettings
      });
    }
  }

}


