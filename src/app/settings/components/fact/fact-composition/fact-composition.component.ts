import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FactDefinition } from 'src/app/settings/interfaces/fact';
import { SettingsTableRow, SettingsTableElementClasses, TableSettingsData } from 'src/app/shared/models/settings-table';
import { Icons } from 'src/app/shared/constants/icons';
import { InputWithSuggestionsData, InputWithSuggestionsElement } from 'src/app/shared/models/input-with-suggestions';
import { FactService } from 'src/app/settings/services/fact.service';
import { MatDialog } from '@angular/material';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';

@Component({
  selector: 'app-fact-composition',
  templateUrl: './fact-composition.component.html',
  styleUrls: ['./fact-composition.component.scss']
})
export class FactCompositionComponent implements OnInit {

  public icons = Icons;
  public facts: FactDefinition[];
  public factsWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.fact.component.addelement.add',
    elements: []
  };
  private deleteFactEmitter: EventEmitter<number> = new EventEmitter<number>();
  public factTableSettingsData: TableSettingsData = { header: [], rows: [] };
  @Output() isDirtyEmitter = new EventEmitter<boolean>();
  @Input() factIdsInElement: number[];

  constructor(
    private factService: FactService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.insertHeaderInDataTable();
    this.deleteFactEmitter.subscribe((factId: number) => this.removeFact(factId));
    this.fetchFacts();
  }

  private fetchFacts() {
    this.factService.list().subscribe((facts: FactDefinition[]) => {
      this.facts = facts;
      this.insertFactsInTableSettingsData(this.factIdsInElement);
      this.insertFactsInSuggestions(this.facts);
    });
  }

  private insertFactsInTableSettingsData(factIdsInElement) {
    const facts: FactDefinition[] = [];
    factIdsInElement.forEach((id: number) => {
      const factToAdd: FactDefinition = this.facts.find((fact: FactDefinition) => fact.id === id);
      facts.push(factToAdd);
    });
    this.factTableSettingsData.rows = facts.map((fact: FactDefinition) => this.transformFactToRow(fact));
  }

  private insertFactsInSuggestions(facts: FactDefinition[]) {
    this.factsWithSuggestions.elements = facts
      .filter((fact: FactDefinition) => !this.factIsInTableSettingsData(fact.id))
      .map((fact: FactDefinition) => this.transformFactToSuggestions(fact));
  }

  private factIsInTableSettingsData(factId: number): boolean {
    const factIndex = this.factTableSettingsData.rows
      .findIndex((row: SettingsTableRow) => row.objectId === factId);
    return factIndex !== -1;
  }

  public addFact(factId: number) {
    this.isDirtyEmitter.emit(true);
    const factToAdd: FactDefinition = this.facts.find((fact: FactDefinition) => fact.id === factId);
    this.factTableSettingsData.rows.push(this.transformFactToRow(factToAdd));
    this.factsWithSuggestions.elements = this.factsWithSuggestions.elements
      .filter((suggestion: InputWithSuggestionsElement) => suggestion.objectId !== factId);
  }

  public removeFact(factId: number) {
    this.isDirtyEmitter.emit(true);
    const factToRemove: FactDefinition = this.facts.find((fact: FactDefinition) => fact.id === factId);
    this.factTableSettingsData.rows = this.factTableSettingsData.rows
      .filter((factRow: SettingsTableRow) => factRow.objectId !== factId);
    this.factsWithSuggestions.elements.push(this.transformFactToSuggestions(factToRemove));
  }

  public displayMultipleFactSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '60%',
      height: '60vh',
      data: {
        title: 'settings.fact.component.addelement.add',
        search: 'settings.fact.component.addelement.search',
        selected: 'settings.fact.component.addelement.selected',
        elements: this.facts
          .filter((fact: FactDefinition) => !this.factIsInTableSettingsData(fact.id))
          .map((fact: FactDefinition): MultipleSelectionElement => {
            return {
              name: fact.name,
              id: fact.id
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addFact(element.id));
    });
  }

  public reset() {
    this.insertFactsInTableSettingsData(this.factIdsInElement);
    this.insertFactsInSuggestions(this.facts);
  }

  public getFactIds(): number[] {
    return this.factTableSettingsData.rows.map((factRow: SettingsTableRow) => factRow.objectId);
  }

  private insertHeaderInDataTable() {
    this.factTableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_4]
      },
      {
        text: 'settings.fact.attribute.model.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.fact.attribute.intent.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.fact.attribute.istemplate.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  private transformFactToSuggestions(fact: FactDefinition): InputWithSuggestionsElement {
    return {
      objectId: fact.id,
      content: fact.name
    };
  }

  private transformFactToRow(fact: FactDefinition): SettingsTableRow {
    return {
      objectId: fact.id,
      rowElements: [
        {
          text: fact.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          text: fact.name,
          classes: [SettingsTableElementClasses.COL_4]
        },
        {
          text: fact.model,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: fact.intent.name,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: fact.isTemplate ? 'Template' : '',
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.TEMPLATE_INDICATOR]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteFactEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

}
