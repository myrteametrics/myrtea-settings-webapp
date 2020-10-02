import {
  SituationBusinessRuleCompositionComponent
} from './components/situation/situation-edit/situation-business-rule-composition/situation-business-rule-composition.component';
import {
  SituationInstanceCompositionComponent
} from './components/situation/situation-edit/situation-instance-composition/situation-instance-composition.component';
import {
  SituationInstanceEditComponent
} from './components/situation/situation-edit/situation-instance-composition/situation-instance-edit/situation-instance-edit.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AppRoutingModule } from '../app-routing.module';
import { MaterialModule } from '../shared/modules/material/material.module';
import { SharedModule } from '../shared/shared.module';
import {
  BusinessRuleCaseCompositionComponent
} from './components/business-rule/business-rule-edit/business-rule-case-composition/business-rule-case-composition.component';
import {
  BusinessRuleCaseEditComponent
} from './components/business-rule/business-rule-edit/business-rule-case-edit/business-rule-case-edit.component';
import { BusinessRuleEditComponent } from './components/business-rule/business-rule-edit/business-rule-edit.component';
import {
  BusinessRuleSituationCompositionComponent
} from './components/business-rule/business-rule-edit/business-rule-situation-composition/business-rule-situation-composition.component';
import { BusinessRulesListComponent } from './components/business-rule/business-rule-list/business-rules-list.component';
import { FactConditionComponent } from './components/fact/fact-edit/fact-condition/fact-condition.component';
import { FactEditComponent } from './components/fact/fact-edit/fact-edit.component';
import { FactTestComponent } from './components/fact/fact-edit/fact-test/fact-test.component';
import { FactListComponent } from './components/fact/fact-list/fact-list.component';
import { ModelEditComponent } from './components/model/model-edit/model-edit.component';
import { ModelListComponent } from './components/model/model-list/model-list.component';
import { RootCausesListComponent } from './components/root-causes/root-causes-list/root-causes-list.component';
import {
  SchedulerBaselineCompositionComponent
} from './components/scheduler/scheduler-edit/scheduler-baseline-composition/scheduler-baseline-composition.component';
import { SchedulerEditComponent } from './components/scheduler/scheduler-edit/scheduler-edit.component';
import { SchedulerListComponent } from './components/scheduler/scheduler-list/scheduler-list.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SituationEditComponent } from './components/situation/situation-edit/situation-edit.component';
import { SituationListComponent } from './components/situation/situation-list/situation-list.component';
import { AdministrationModule } from '../administration/administration.module';
import { FactCompositionComponent } from './components/fact/fact-composition/fact-composition.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { CalendarListComponent } from './components/calendar/calendar-list/calendar-list.component';
import { CalendarEditComponent } from './components/calendar/calendar-edit/calendar-edit.component';
import { CalendarCompositionComponent } from './components/calendar/calendar-composition/calendar-composition.component';
import { PeriodListComponent } from './components/calendar/calendar-edit/period/period-list/period-list.component';
import { PeriodEditComponent } from './components/calendar/calendar-edit/period/period-edit/period-edit.component';
import {
  BusinessRuleActionEditComponent
  // tslint:disable-next-line: max-line-length
} from './components/business-rule/business-rule-edit/business-rule-case-edit/business-rule-action-edit/business-rule-action-edit.component';

@NgModule({
  declarations: [
    ModelListComponent,
    ModelEditComponent,
    FactEditComponent,
    FactConditionComponent,
    FactTestComponent,
    SettingsComponent,
    FactListComponent,
    SituationListComponent,
    BusinessRulesListComponent,
    RootCausesListComponent,
    SchedulerListComponent,
    SituationEditComponent,
    SituationBusinessRuleCompositionComponent,
    SchedulerEditComponent,
    SchedulerBaselineCompositionComponent,
    SituationInstanceCompositionComponent,
    SituationInstanceEditComponent,
    BusinessRuleEditComponent,
    BusinessRuleSituationCompositionComponent,
    BusinessRuleCaseCompositionComponent,
    BusinessRuleCaseEditComponent,
    FactCompositionComponent,
    UserSettingsComponent,
    CalendarListComponent,
    CalendarEditComponent,
    CalendarCompositionComponent,
    PeriodListComponent,
    PeriodEditComponent,
    BusinessRuleActionEditComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MaterialModule,
    AdministrationModule
  ],
  entryComponents: [
    FactTestComponent,
    SituationInstanceEditComponent,
    PeriodEditComponent,
    BusinessRuleActionEditComponent
  ],
  exports: [
    SettingsComponent
  ]
})
export class SettingsModule { }
