import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmationPopUpComponent } from './components/confirmation-pop-up/confirmation-pop-up.component';
import { InputWithSuggestionsComponent } from './components/input-with-suggestions/input-with-suggestions.component';
import { SettingsControlBarComponent } from './components/settings-control-bar/settings-control-bar.component';
import { SettingsTableComponent } from './components/settings-table/settings-table.component';
import { MaterialModule } from './modules/material/material.module';
import { MultipleSelectionPopUpComponent } from './components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { BubblesListingComponent } from './components/bubbles-listing/bubbles-listing.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HasRightDirective } from './directives/has-right.directive';

@NgModule({
  declarations: [
    SettingsControlBarComponent,
    InputWithSuggestionsComponent,
    ConfirmationPopUpComponent,
    SettingsTableComponent,
    MultipleSelectionPopUpComponent,
    BubblesListingComponent,
    HasRightDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgApexchartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule,
    SettingsControlBarComponent,
    InputWithSuggestionsComponent,
    ConfirmationPopUpComponent,
    SettingsTableComponent,
    MultipleSelectionPopUpComponent,
    BubblesListingComponent,
    HasRightDirective
  ],
  entryComponents: [
    ConfirmationPopUpComponent,
    MultipleSelectionPopUpComponent
  ]
})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
