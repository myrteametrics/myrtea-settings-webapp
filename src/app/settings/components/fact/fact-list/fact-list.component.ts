import { Component, OnInit, EventEmitter } from '@angular/core';
import { FactService } from '../../../services/fact.service';
import { FactDefinition } from '../../../interfaces/fact';
import { Icons } from 'src/app/shared/constants/icons';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';

@Component({
  selector: 'app-fact-list',
  templateUrl: './fact-list.component.html',
  styleUrls: ['./fact-list.component.scss']
})
export class FactListComponent implements OnInit {

  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  private facts: FactDefinition[];
  public icons = Icons;
  deleteFactEmitter: EventEmitter<number> = new EventEmitter();
  displayFactEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private factService: FactService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.deleteFactEmitter.subscribe((factId: number): void => this.deleteFact(factId));
    this.displayFactEmitter.subscribe((factId: number): void => this.displayFactEdition(factId));
    this.factService.list().subscribe((facts: FactDefinition[]) => {
      this.insertDataInTab(facts);
      this.facts = facts;
    });
  }

  private insertDataInTab(facts: FactDefinition[]) {
    this.tableSettingsData.header = [
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
    this.tableSettingsData.rows = facts.map((fact: FactDefinition) => this.transformFactToRow(fact));
  }

  private transformFactToRow(fact: FactDefinition): SettingsTableRow {
    return {
      objectId: fact.id,
      click: this.displayFactEmitter,
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
          text: fact.intent && fact.intent.name ? fact.intent.name : '',
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

  public searchFact(value: string) {
    this.tableSettingsData.rows = this.facts
      .filter((fact: FactDefinition) => fact.name.includes(value))
      .map((fact: FactDefinition) => this.transformFactToRow(fact));
  }

  public deleteFact(id: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.fact.component.deletewindow.title',
        content: 'settings.fact.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.factService.delete(id).subscribe(() => {
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== id);
        });
      }
    });
  }

  public displayFactEdition(id: number) {
    this.router.navigate(['/settings/facts', id]);
  }

}
