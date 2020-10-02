import { Component, Input, OnInit } from '@angular/core';
import { SettingsTableElementInRow, SettingsTableRow, TableSettingsData } from 'src/app/shared/models/settings-table';
import { Icons } from '@shared/constants/icons';

@Component({
  selector: 'app-settings-table',
  templateUrl: './settings-table.component.html',
  styleUrls: ['./settings-table.component.scss']
})
export class SettingsTableComponent implements OnInit {


  @Input() data: TableSettingsData;
  @Input() emptyMessage: string;
  public icons = Icons;

  constructor() { }

  ngOnInit() { }

  public onRowClick(row: SettingsTableRow): void {
    if (row.click) {
      row.click.emit(row.objectId);
    }
  }

  public onElementInRowClick(rowId: number, attribute: SettingsTableElementInRow, event: Event): void {
    if (attribute.click) {
      event.stopPropagation();
      attribute.click.emit(rowId);
    }
  }

  public joinClasses(attribute: SettingsTableElementInRow): string {
    return attribute && attribute.classes ? attribute.classes.join(' ') : '';
  }

  public upElement(index: number) {
    if (index !== 0) {
      const tmp = this.data.rows[index];
      this.data.rows[index] = this.data.rows[index - 1];
      this.data.rows[index - 1] = tmp;
      this.data.orderedEmitter.emit(true);
    }
  }

  public dowElement(index: number) {
    if (index !== (this.data.rows.length - 1)) {
      const tmp = this.data.rows[index];
      this.data.rows[index] = this.data.rows[index + 1];
      this.data.rows[index + 1] = tmp;
      this.data.orderedEmitter.emit(true);
    }
  }
}
