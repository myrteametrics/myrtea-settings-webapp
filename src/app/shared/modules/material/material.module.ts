import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import {
  MatButtonModule,
  MatSelectModule,
  MatInputModule,
  MatDialogModule,
  MatIconModule,
  MatSidenavModule,
  MatMenuModule,
  MatTooltipModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';

@NgModule({
  declarations: [],
  exports: [
    CommonModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDialogModule,
    MatIconModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class MaterialModule { }
