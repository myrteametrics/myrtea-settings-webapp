import { Component, OnInit, EventEmitter } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';
import { SecurityGroupService } from 'src/app/administration/services/security-group.service';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';

@Component({
  selector: 'app-security-group-list',
  templateUrl: './security-group-list.component.html',
  styleUrls: ['./security-group-list.component.scss']
})
export class SecurityGroupListComponent implements OnInit {

  public icons = Icons;
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public groups: SecurityGroup[] = [];
  public deleteGroupEmitter: EventEmitter<number> = new EventEmitter();
  public displayGroupEmitter: EventEmitter<number> = new EventEmitter();

  constructor(
    private groupService: SecurityGroupService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.deleteGroupEmitter.subscribe((groupId: number) => {
      this.deleteGroup(groupId);
    });
    this.displayGroupEmitter.subscribe((groupId: number): void => {
      this.displayGroupEdition(groupId);
    });
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_3]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      },
    ];
    this.fetchGroup();
  }

  public fetchGroup() {
    this.groupService.list().subscribe((groups) => {
      this.groups = groups;
      this.groups.forEach((group: SecurityGroup) => {
        this.tableSettingsData.rows.push(this.transformGroupToRow(group));
      });
    });
  }

  public searchGroup(value: string) {
    this.tableSettingsData.rows = this.groups
      .filter((group: SecurityGroup) => group.name.includes(value)) // Filter for user serch
      .map((group: SecurityGroup) => this.transformGroupToRow(group)); // Transform group into TabbleRow
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }

  public deleteGroup(objectId: number) {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.group.component.deletewindow.title',
        content: 'settings.group.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.groupService.delete(objectId).subscribe(() => {
          this.tableSettingsData.rows = this.tableSettingsData.rows.filter(element => element.objectId !== objectId);
          this.groups = this.groups.filter(element => element.id !== objectId);
          this.openSnackBar('MISSING');
        });
      }
    });
  }

  public displayGroupEdition(groupId: number) {
    this.router.navigate(['/administration/security-groups', groupId]);
  }

  private transformGroupToRow(group: SecurityGroup): SettingsTableRow {
    return {
      rowElements: [
        {
          text: group.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          icon: Icons.GROUP.name,
          text: group.name,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteGroupEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ],
      objectId: group.id,
      click: this.displayGroupEmitter
    };
  }

}
