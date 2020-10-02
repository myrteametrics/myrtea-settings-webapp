import { Component, OnInit, EventEmitter } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { UserService } from 'src/app/administration/services/user.service';
import { User } from 'src/app/administration/interfaces/user';
import { TranslateService } from '@ngx-translate/core';
import { SettingsTableRow, SettingsTableElementClasses, TableSettingsData } from 'src/app/shared/models/settings-table';
import { Router } from '@angular/router';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  public icons = Icons;
  private users: User[];
  private translations: any;
  private deleteUserEmitter = new EventEmitter<number>();
  private displayUserEditionEmitter = new EventEmitter<number>();
  public tableSettingsData: TableSettingsData = { header: [], rows: [] };


  constructor(
    private userService: UserService,
    private translateService: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.deleteUserEmitter.subscribe((userId: number) => this.removeUser(userId));
    this.displayUserEditionEmitter.subscribe((userId: number) => this.displayUserEdition(userId));
    this.translateService.get('administration.users').subscribe((translations) => {
      this.translations = translations;
      this.fetchUsers();
    });
  }

  private fetchUsers() {
    this.userService.list().subscribe((users: User[]) => {
      this.users = users;
      this.insertUsersInTable(users);
      this.insertLablesInTabbleaHeader();
    });
  }

  private displayUserEdition(userId: number) {
    this.router.navigate(['/administration/users', userId]);
  }

  private insertLablesInTabbleaHeader() {
    this.tableSettingsData.header = [
      {
        text: 'settings.shared.attribute.id.label',
        classes: [SettingsTableElementClasses.COL_1]
      },
      {
        text: 'settings.shared.attribute.name.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: 'settings.user.attribute.email.label',
        classes: [SettingsTableElementClasses.COL_3]
      },
      {
        text: 'settings.user.attribute.grouprole.label',
        classes: [SettingsTableElementClasses.COL_2]
      },
      {
        text: '',
        classes: [SettingsTableElementClasses.COL]
      }
    ];
  }

  private insertUsersInTable(users: User[]) {
    const userRows: SettingsTableRow[] = [];
    users.forEach((user: User) => {
      userRows.push(this.transformUserToRow(user));
    });
    this.tableSettingsData.rows = userRows;
  }

  private transformUserToRow(user: User): SettingsTableRow {
    return {
      objectId: user.id,
      click: this.displayUserEditionEmitter,
      rowElements: [
        {
          text: user.id.toString(),
          classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
        },
        {
          icon: Icons.USER.name,
          text: `${user.firstName} ${user.lastName}`,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          text: user.email,
          classes: [SettingsTableElementClasses.COL_3]
        },
        {
          text: user.role === 1 ? this.translations.admin : this.translations.user,
          classes: [SettingsTableElementClasses.COL_2]
        },
        {
          icon: Icons.TRASH.name,
          click: this.deleteUserEmitter,
          classes: [SettingsTableElementClasses.COL, SettingsTableElementClasses.DELETE]
        }
      ]
    };
  }

  private removeUser(userId: number) {
    const userToDelete: User = this.users
      .find((user: User) => user.id === userId);
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.user.component.deletewindow.title',
        content: 'settings.user.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.userService.delete(userToDelete.id).subscribe(() => {
          this.snackBar.open(this.translations.userWasDeleted, null, { duration: 2000 });
          this.tableSettingsData.rows = this.tableSettingsData.rows
            .filter((userRow: SettingsTableRow) => userRow.objectId !== userToDelete.id);
        });
      }
    });
  }

  public searchUser(value: string) {
    this.tableSettingsData.rows = this.users
      .filter((user: User) => {
        const userName = `${user.firstName} ${user.name}`;
        return userName.includes(value);
      })
      .map((user: User) => this.transformUserToRow(user));
  }

}
