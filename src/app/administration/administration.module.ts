import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SharedModule } from '../shared/shared.module';
import { AdministrationComponent } from './components/administration/administration.component';
import { SecurityGroupEditComponent } from './components/security-group/security-group-edit/security-group-edit.component';
import { SecurityGroupListComponent } from './components/security-group/security-group-list/security-group-list.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';
import { UserListComponent } from './components/user/user-list/user-list.component';
import {
  SecurityGroupCompositionComponent
} from './components/security-group/security-group-composition/security-group-composition.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    UserListComponent,
    UserEditComponent,
    SecurityGroupListComponent,
    SecurityGroupEditComponent,
    SecurityGroupCompositionComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    SecurityGroupCompositionComponent
  ]
})
export class AdministrationModule { }
