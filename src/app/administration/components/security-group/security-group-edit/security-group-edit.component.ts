import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { SecurityGroupService } from 'src/app/administration/services/security-group.service';
import { Icons } from 'src/app/shared/constants/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/administration/interfaces/user';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';
import { InputWithSuggestionsData, InputWithSuggestionsElement } from 'src/app/shared/models/input-with-suggestions';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Membership } from 'src/app/administration/interfaces/membership';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { UserService } from 'src/app/administration/services/user.service';
import { TableSettingsData, SettingsTableRow, SettingsTableElementClasses } from 'src/app/shared/models/settings-table';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-security-group-edit',
  templateUrl: './security-group-edit.component.html',
  styleUrls: ['./security-group-edit.component.scss']
})
export class SecurityGroupEditComponent implements OnInit, OnDestroy {

  public tableSettingsData: TableSettingsData = { header: [], rows: [] };
  public inputWithSuggestionsData: InputWithSuggestionsData = {
    label: 'settings.user.component.addelement.add',
    elements: []
  };
  public users: User[] = [];
  public userChange = false;
  public icons = Icons;
  public creationMode: boolean;
  private initialMembership: Membership[];
  public group: SecurityGroup = { memberships: [], name: '' };
  public deleteUserEmitter: EventEmitter<number> = new EventEmitter();
  public changeUserRoleEmitter: EventEmitter<number> = new EventEmitter();
  public formGroup = this.formBuilder.group({
    name: ['', Validators.required]
  });

  constructor(
    private headerService: HeaderService,
    private groupService: SecurityGroupService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.deleteUserEmitter.subscribe((userId: number): void => {
      this.deleteUser(userId);
    });
    this.changeUserRoleEmitter.subscribe((userId: number): void => {
      this.changeUserRole(userId);
    });
    this.creationMode = this.route.snapshot.data.creationMode;
    this.headerService.changeVisibility(false);
    this.tableSettingsData.header = [{
      text: 'settings.shared.attribute.id.label',
      classes: [SettingsTableElementClasses.COL_1]
    }, {
      text: 'settings.shared.attribute.name.label',
      classes: [SettingsTableElementClasses.COL_2]
    }, {
      text: 'settings.user.attribute.email.label',
      classes: [SettingsTableElementClasses.COL_3]
    }, {
      text: 'settings.user.attribute.grouprole.label',
      classes: [SettingsTableElementClasses.COL_2]
    }, {
      text: '',
      classes: [SettingsTableElementClasses.COL]
    },
    ];
    this.fetchUsers();
    if (!this.creationMode) {
      this.route.params.subscribe((routeParams) => {
        this.fetchGroupInformations(routeParams.id);
      });
    }
  }

  private fetchGroupInformations(groupId: number) {
    this.groupService.read(groupId).subscribe((group: SecurityGroup) => {
      this.formGroup.setValue({
        name: group.name
      });
      this.group = group;
      this.fetchMemberShip(groupId);
    });
  }

  private fetchMemberShip(groupId: number) {
    this.groupService.getMemberships(groupId).subscribe((memberships) => {
      this.initialMembership = Object.values(memberships);
      this.group.memberships = Object.values(memberships);
      this.insertDataInTable(this.group.memberships);
      this.insertDataInSuggestion(this.users);
    });
  }

  private insertDataInTable(memberships: Membership[]) {
    this.tableSettingsData.rows = memberships.map((membership: Membership): SettingsTableRow => {
      return {
        objectId: membership.id,
        rowElements: [
          {
            text: membership.id.toString(),
            classes: [SettingsTableElementClasses.COL_1, SettingsTableElementClasses.BOLD]
          },
          {
            icon: Icons.USER.name,
            text: `${membership.firstName} ${membership.lastName}`,
            classes: [SettingsTableElementClasses.COL_2]
          },
          {
            text: membership.email,
            classes: [SettingsTableElementClasses.COL_3]
          },
          {
            icon: Icons.RESPONSABLE.name,
            text: membership.groupRole === 1 ? 'this.translations.responsable' : '',
            click: this.changeUserRoleEmitter,
            tooltip: membership.groupRole === 1 ?
              'this.translations.removeResponsability' : 'this.translations.nameAsResponsable',
            classes: membership.groupRole !== 1 ?
              [SettingsTableElementClasses.COL_2, SettingsTableElementClasses.SIMPLE_USER, SettingsTableElementClasses.CURSOR_HOVER] :
              [SettingsTableElementClasses.COL_2, SettingsTableElementClasses.CURSOR_HOVER]
          },
          {
            icon: Icons.TRASH.name, click: this.deleteUserEmitter,
            classes: [SettingsTableElementClasses.DELETE, SettingsTableElementClasses.COL]
          }
        ]
      };
    });
  }

  private insertDataInSuggestion(users: User[]) {
    this.inputWithSuggestionsData.elements = users
      .filter((user: User) => {
        return !this.userIsMember(user.id);
      })
      .map((user: User): InputWithSuggestionsElement => {
        return {
          objectId: user.id,
          content: `${user.firstName} ${user.lastName}`,
          icon: Icons.USER.name
        };
      });
  }

  private fetchUsers() {
    this.userService.list().subscribe((users: User[]) => {
      this.users = users;
      if (this.creationMode) {
        this.insertDataInSuggestion(this.users);
      }
    });
  }

  public deleteUser(userId: number) {
    this.userChange = true;
    this.group.memberships = this.group.memberships.filter((memberShip: Membership) => userId !== memberShip.id);
    this.insertDataInTable(this.group.memberships);
    this.insertDataInSuggestion(this.users);
  }

  public changeUserRole(userId: number) {
    this.userChange = true;
    const userIndex: number = this.group.memberships.findIndex((memberShip: Membership) => userId === memberShip.id);
    const currentGroupRole = this.group.memberships[userIndex].groupRole;
    this.group.memberships[userIndex].groupRole = currentGroupRole !== 1 ? 1 : 2;
    this.insertDataInTable(this.group.memberships);
  }

  public displayUsersSelectionWindow() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '40%',
      height: '50vh',
      data: {
        title: 'settings.user.component.addelement.add',
        search: 'settings.user.component.addelement.search',
        selected: 'settings.user.component.addelement.selected',
        elements: this.users
          .filter((user: User) => !this.userIsMember(user.id))
          .map((user: User): MultipleSelectionElement => {
            return {
              name: `${user.firstName} ${user.lastName}`,
              id: user.id,
              icon: Icons.USER.name
            };
          })
      }
    }).afterClosed().subscribe((result) => {
      if (!result) { return; }
      result.forEach((element: MultipleSelectionElement) => {
        const userToAdd: User = this.users.find((user: User) => element.id === user.id);
        this.addUser(userToAdd);
      });
    });
  }

  private userIsMember(userId: number) {
    const userIndex = this.group.memberships.findIndex((memberShip: Membership) => userId === memberShip.id);
    if (userIndex === -1) { return false; }
    return true;
  }

  public addUser(user: User) {
    this.userChange = true;
    this.group.memberships.push({
      id: user.id,
      lastName: user.lastName,
      firstName: user.firstName,
      email: user.email,
      groupRole: 2,
    });
    this.insertDataInTable(this.group.memberships);
    this.insertDataInSuggestion(this.users);
  }

  public addUserById(userId: number) {
    this.addUser(this.users.find((user: User) => userId === user.id));
  }

  public saveGroup() {
    if (!this.groupIsModified()) { return; }
    this.group.name = this.formGroup.value.name;
    if (this.creationMode) {
      this.groupService.createGroup(this.group);
    } else {
      this.groupService.putGroup(this.group);
      this.initialMembership
        .filter((membership: Membership) => !this.userIsMember(membership.id))
        .map((membership: Membership) => {
          this.groupService.deleteMembership(this.group.id, membership.id);
        });
      this.return();
    }
  }

  public deleteGroup() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.group.component.deletewindow.title',
        content: 'settings.group.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.groupService.delete(this.group.id).subscribe(() => {
          this.return();
          this.snackBar.open('MISSING', null, { duration: 2000 });
        });
      }
    });
  }

  public groupIsModified() {
    return this.userChange && this.formGroup.valid;
  }

  public return() {
    this.router.navigate(['/administration/security-groups']);
  }

  public cancel() {
    if (this.creationMode) {
      this.return();
    } else {
      this.userChange = false;
      this.fetchGroupInformations(this.group.id);
    }
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

}
