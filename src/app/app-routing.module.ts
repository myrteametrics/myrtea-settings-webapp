import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/components/login/login.component';
import { AuthGuardService as AuthGuard } from './authentication/services/auth-guard.service';
import { LoginGuardService as LoginGuard } from './authentication/services/login-guard.service';
import { ContainerComponent } from './shared/components/container/container.component';
import { ModelEditComponent } from './settings/components/model/model-edit/model-edit.component';
import { FactEditComponent } from './settings/components/fact/fact-edit/fact-edit.component';
import { AdministrationComponent } from 'src/app/administration/components/administration/administration.component';
import { AdministrationState } from 'src/app/administration/interfaces/administration-state';
import { SettingsComponent } from './settings/components/settings/settings.component';
import { SettingsState } from './settings/interfaces/states/settings-state';
import { SituationEditComponent } from './settings/components/situation/situation-edit/situation-edit.component';
import { UserEditComponent } from './administration/components/user/user-edit/user-edit.component';
import { SecurityGroupEditComponent } from './administration/components/security-group/security-group-edit/security-group-edit.component';
import { SchedulerEditComponent } from './settings/components/scheduler/scheduler-edit/scheduler-edit.component';
import { BusinessRuleEditComponent } from './settings/components/business-rule/business-rule-edit/business-rule-edit.component';
import { RoleGuardService } from '@shared/guards/role-guard.service';
import { MyrteaPermission } from '@shared/models/permission';
import { UserSettingsComponent } from './settings/components/user-settings/user-settings.component';
import { CalendarEditComponent } from './settings/components/calendar/calendar-edit/calendar-edit.component';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
  {
    path: 'forbidden',
    component: ContainerComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'user-settings',
    canActivate: [AuthGuard, RoleGuardService],
    component: ContainerComponent,
    data: { permission: MyrteaPermission.viewUserSettings },
    children: [
      { path: '', component: UserSettingsComponent }
    ]
  },
  {
    path: 'settings',
    component: ContainerComponent,
    canActivate: [AuthGuard, RoleGuardService],
    // canActivate: [AuthGuard],
    data: { permission: MyrteaPermission.viewSettings },
    children: [
      { path: '', data: { permission: MyrteaPermission.viewSettings }, redirectTo: 'models', pathMatch: 'full' },

      {
        path: 'models',
        component: SettingsComponent,
        data: { permission: MyrteaPermission.viewSettings, state: SettingsState.MODELSETTINGS }
      },
      { path: 'models/new', component: ModelEditComponent, data: { permission: MyrteaPermission.viewSettings, creationMode: true } },
      { path: 'models/:id', component: ModelEditComponent, data: { permission: MyrteaPermission.viewSettings, creationMode: false } },

      {
        path: 'calendars',
        component: SettingsComponent,
        data: { permission: MyrteaPermission.viewSettings, state: SettingsState.CALENDARSETTINGS }
      },
      {
        path: 'calendars/new',
        component: CalendarEditComponent,
        data: { permission: MyrteaPermission.viewUserSettings, creationMode: true }
      },
      {
        path: 'calendars/:id',
        component: CalendarEditComponent,
        data: { permission: MyrteaPermission.viewUserSettings, creationMode: false }
      },


      {
        path: 'facts',
        component: SettingsComponent,
        data: { permission: MyrteaPermission.viewSettings, state: SettingsState.FACTSETTINGS }
      },
      { path: 'facts/new', component: FactEditComponent, data: { permission: MyrteaPermission.viewSettings, creationMode: true } },
      { path: 'facts/:id', component: FactEditComponent, data: { permission: MyrteaPermission.viewSettings, creationMode: false } },

      {
        path: 'situations',
        component: SettingsComponent,
        data: { permission: MyrteaPermission.viewSettings, state: SettingsState.SITUATIONSETTINGS }
      },
      {
        path: 'situations/new',
        component: SituationEditComponent, data: { permission: MyrteaPermission.viewSettings, creationMode: true }
      },
      {
        path: 'situations/:id',
        component: SituationEditComponent,
        data: { permission: MyrteaPermission.viewSettings, creationMode: false }
      },

      {
        path: 'business-rules',
        component: SettingsComponent,
        data: {
          permission: MyrteaPermission.viewSettings, state: SettingsState.BUSINESSRULESSETTINGS
        }
      },
      {
        path: 'business-rules/new',
        component: BusinessRuleEditComponent,
        data: { permission: MyrteaPermission.viewSettings, creationMode: true }
      },
      {
        path: 'business-rules/:id',
        component: BusinessRuleEditComponent,
        data: { permission: MyrteaPermission.viewSettings, creationMode: false }
      },

      {
        path: 'schedulers',
        component: SettingsComponent,
        data: { permission: MyrteaPermission.viewSettings, state: SettingsState.SCHEDULERSETTINGS }
      },
      {
        path: 'schedulers/new',
        component: SchedulerEditComponent,
        data: { permission: MyrteaPermission.viewSettings, creationMode: true }
      },
      {
        path: 'schedulers/:id',
        component: SchedulerEditComponent,
        data: { permission: MyrteaPermission.viewSettings, creationMode: false }
      },

      // { path: 'root-causes-actions', component: SettingsComponent, data: { state: SettingsState.ROOTCAUSESACTIONSSETTINGS } }
    ]
  },
  {
    path: 'administration',
    component: ContainerComponent,
    canActivate: [AuthGuard, RoleGuardService],
    data: { permission: MyrteaPermission.viewAdministration },
    children: [
      {
        path: 'users',
        component: AdministrationComponent,
        data: { permission: MyrteaPermission.viewAdministration, state: AdministrationState.USERADMINISTRATION }
      },
      { path: 'users/new', component: UserEditComponent, data: { permission: MyrteaPermission.viewAdministration, creationMode: true } },
      {
        path: 'users/:id',
        component: UserEditComponent,
        data: { permission: MyrteaPermission.viewAdministration, creationMode: false }
      },

      {
        path: 'security-groups',
        component: AdministrationComponent,
        data: { permission: MyrteaPermission.viewAdministration, state: AdministrationState.SECURITYGROUPADMINISTRATION }
      },
      {
        path: 'security-groups/new',
        component: SecurityGroupEditComponent,
        data: { permission: MyrteaPermission.viewAdministration, creationMode: true }
      },
      {
        path: 'security-groups/:id',
        component: SecurityGroupEditComponent,
        data: { permission: MyrteaPermission.viewAdministration, creationMode: false }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
