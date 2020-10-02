import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { SchedulerJob, SchedulerJobType, SchedulerJobBaseline } from 'src/app/settings/interfaces/scheduler';
import { BaselineService } from 'src/app/settings/services/baseline.service';
import { BaselineDefinition } from 'src/app/settings/interfaces/baseline';
import { Icons } from 'src/app/shared/constants/icons';
import { TranslateService } from '@ngx-translate/core';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';
import { InputWithSuggestionsData } from 'src/app/shared/models/input-with-suggestions';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MatDialog } from '@angular/material';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';

@Component({
  selector: 'app-scheduler-baseline-composition',
  templateUrl: './scheduler-baseline-composition.component.html',
  styleUrls: ['./scheduler-baseline-composition.component.scss']
})
export class SchedulerBaselineCompositionComponent implements OnInit {

  @Input() schedulerJobBaseline: SchedulerJobBaseline;
  @Output() isDirtyEmitter = new EventEmitter<boolean>();

  public baselines: BaselineDefinition[];
  public icons = Icons;
  public translations: any;
  public baselineTableSettingsData: TableSettingsData = { header: [], rows: [] };
  public baselinesWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.baseline.component.addelement.add',
    elements: []
  };
  private deleteBaselineEmitter: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private baselineService: BaselineService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.deleteBaselineEmitter.subscribe((baselineId: number) => this.removeBaseline(baselineId));
    this.insertHeaderInDataTable();
    this.fetchBaselines();
  }

  private fetchBaselines() {
    this.baselineService.list().subscribe((baselines: BaselineDefinition[]) => {
      this.baselines = baselines;
      if (this.schedulerJobBaseline) {
        this.insertBaselinesInDataTable();
      }
      this.insertBaselinesInSuggestions();
    });
  }

  public reset() {
    if (this.schedulerJobBaseline) {
      this.insertBaselinesInDataTable();
    }
    this.insertBaselinesInSuggestions();
  }

  private insertHeaderInDataTable() {
    this.baselineTableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3]
      },
      {
        text: 'settings.baseline.attribute.factname.label',
        classes: [SettingsTableElementClasses.COL_4]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  private insertBaselinesInDataTable() {
    const baselineIds = this.schedulerJobBaseline.baselineIds;
    const factRows: SettingsTableRow[] = [];
    this.baselines.forEach((baseline: BaselineDefinition) => {
      if (baselineIds.includes(baseline.id)) {
        factRows.push(this.transformBaselineToRow(baseline));
      }
    });
    this.baselineTableSettingsData.rows = factRows;
  }

  private transformBaselineToRow(baseline: BaselineDefinition): SettingsTableRow {
    return {
      objectId: baseline.id,
      rowElements: [
        {
          text: baseline.id.toString(),
          classes: [SettingsTableElementClasses.BOLD, SettingsTableElementClasses.COL_1]
        },
        {
          text: baseline.name,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          text: baseline.factName,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteBaselineEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  private baselineIsInScheduler(baseline: BaselineDefinition): boolean {
    const baselineIndex = this.baselineTableSettingsData.rows.findIndex((rows: SettingsTableRow) => rows.objectId === baseline.id);
    if (baselineIndex === - 1) { return false; }
    return true;
  }

  private removeBaseline(baselineId: number) {
    this.isDirtyEmitter.emit(true);
    this.baselineTableSettingsData.rows = this.baselineTableSettingsData.rows
      .filter((baselineRow: SettingsTableRow) => baselineRow.objectId !== baselineId);
    this.insertBaselinesInSuggestions();
  }

  public addBaseline(baselineId: number) {
    this.isDirtyEmitter.emit(true);
    const baselineToAdd: BaselineDefinition = this.baselines.find((baseline: BaselineDefinition) => baseline.id === baselineId);
    this.baselineTableSettingsData.rows.push(this.transformBaselineToRow(baselineToAdd));
    this.insertBaselinesInSuggestions();
  }

  private insertBaselinesInSuggestions() {
    this.baselinesWithSuggestions.elements = this.baselines
      .filter((baseline: BaselineDefinition) => !this.baselineIsInScheduler(baseline))
      .map((baseline: BaselineDefinition) => {
        return {
          objectId: baseline.id,
          content: `${baseline.name} (${baseline.factName})`
        };
      });
  }

  public displayMultipleFactSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '60%',
      height: '50vh',
      data: {
        title: 'settings.baseline.component.addelement.add',
        search: 'settings.baseline.component.addelement.search',
        selected: 'settings.baseline.component.addelement.selected',
        elements: this.baselines
          .filter((baseline: BaselineDefinition) => !this.baselineIsInScheduler(baseline))
          .map((baseline: BaselineDefinition): MultipleSelectionElement => {
            return {
              id: baseline.id,
              name: `${baseline.name} (${baseline.factName})`
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addBaseline(element.id));
    });
  }

  public getBaselineIds(): number[] {
    return this.baselineTableSettingsData.rows.map((baselineRow: SettingsTableRow) => baselineRow.objectId);
  }

}
