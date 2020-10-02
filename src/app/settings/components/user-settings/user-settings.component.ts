import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { Icons } from '@shared/constants/icons';
import { UserSettingsService } from 'src/app/settings/services/user-settings.service';
import { UserSettings } from 'src/app/settings/interfaces/user-settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  public icons = Icons;
  public settingsForm: FormGroup;

  constructor(
    private headerService: HeaderService,
    private userSettingsService: UserSettingsService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.headerService.changeTitle('settings.title.usersettings');
    const userSettings: UserSettings = this.userSettingsService.getUserSettings();
    this.settingsForm = this.formBuilder.group({
      language: [userSettings.language, Validators.required]
    });
  }

  public saveUserSettings(): void {
    const newUserSettings = {
      language: this.settingsForm.value.language
    };
    this.userSettingsService.saveUserSettings(newUserSettings);
  }

  public formIsValid(): boolean {
    return !!this.settingsForm && this.settingsForm.dirty && this.settingsForm.valid;
  }

}
