import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SidenavComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    AppRoutingModule,
    SharedModule
  ],
  exports: [
    SidenavComponent
  ]
})
export class SidenavModule { }
