import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { UserService } from 'src/app/administration/services/user.service';
import { User } from 'src/app/administration/interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ConfirmationPopUpComponent } from 'src/app/shared/components/confirmation-pop-up/confirmation-pop-up.component';
import { Icons } from 'src/app/shared/constants/icons';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';
import { SecurityGroupCompositionComponent } from '../../security-group/security-group-composition/security-group-composition.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy {

  public userName = '';
  public user: User;
  public creationMode: boolean;
  public icons = Icons;
  public isDirty = false;
  public formUser: FormGroup;
  public groupIds: number[];
  @ViewChild('groupComposition', { static: false }) groupComposition: SecurityGroupCompositionComponent;

  constructor(
    private headerService: HeaderService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.creationMode = this.route.snapshot.data.creationMode;
    this.headerService.changeVisibility(false);
    this.route.params.subscribe((params) => {
      if (!this.creationMode) {
        this.fetchUser(params.id);
      } else {
        this.groupIds = [];
        this.user = {
          groups: []
        };
        this.formUser = this.formBuilder.group({
          email: ['', Validators.required],
          lastName: ['', Validators.required],
          firstName: ['', Validators.required],
          login: ['', [Validators.required, Validators.minLength(3)]],
          role: [2, Validators.required],
          password: ['', [Validators.required, Validators.minLength(6)]]
        });
      }
    });
  }

  public cancel() {
    if (this.creationMode) {
      this.return();
    } else {
      this.isDirty = false;
      this.groupComposition.reset();
      this.formUser.markAsPristine();
      this.insertUserInForm(this.user);
    }
  }

  private createUser(user: User) {
    user = {
      ...user,
      password: this.formUser.value.password
    };
    this.userService.create(user).subscribe(() => {
      this.return();
    });
  }

  private updateUser(user: User) {
    this.userService.update(this.user.id, user).subscribe(() => {
      this.return();
    });
  }

  public save() {
    // TODO: add groups when back is ready
    const user: User = {
      ... this.user,
      firstName: this.formUser.value.firstName,
      lastName: this.formUser.value.lastName,
      email: this.formUser.value.email,
      login: this.formUser.value.login,
      role: Number(this.formUser.value.role),
      // groups: this.groupComposition.getGroupsInComposition();
    };
    this.creationMode ? this.createUser(user) : this.updateUser(user);
  }

  private insertUserInForm(user: User) {
    this.formUser = this.formBuilder.group({
      login: [user.login, [Validators.required, Validators.minLength(3)]],
      email: [user.email, Validators.required],
      lastName: [user.lastName, Validators.required],
      firstName: [user.firstName, Validators.required],
      role: [user.role, Validators.required]
    });
  }

  public delete() {
    this.dialog.open(ConfirmationPopUpComponent, {
      width: '30%',
      data: {
        title: 'settings.user.component.deletewindow.title',
        content: 'settings.user.component.deletewindow.message'
      }
    }).afterClosed().subscribe((validation: boolean) => {
      if (validation) {
        this.userService.delete(this.user.id).subscribe(() => {
          this.return();
          this.snackBar.open('MISSING', null, { duration: 2000 });
        });
      }
    });
  }

  public return() {
    this.router.navigate(['/administration/users']);
  }

  private fetchUser(userId: number) {
    this.userService.read(userId).subscribe((user: User) => {
      this.userName = `${user.firstName} ${user.lastName}`;
      this.groupIds = user.groups.map((group: SecurityGroup) => group.id);
      this.user = user;
      this.insertUserInForm(this.user);
    });
  }

  public formIsValid() {
    return (this.isDirty || this.formUser.dirty) && this.formUser.valid;
  }

  ngOnDestroy() {
    this.headerService.changeVisibility(true);
  }

}
