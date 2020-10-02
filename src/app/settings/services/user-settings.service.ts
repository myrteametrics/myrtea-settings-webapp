import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserSettings } from 'src/app/settings/interfaces/user-settings';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {

  private userSettings: UserSettings = {
    language: environment.defaultLanguage
  };

  constructor(
    private translateService: TranslateService
  ) {
    if (localStorage.getItem('userSettings')) {
      const localStorageUserSettings = JSON.parse(localStorage.getItem('userSettings'));
      this.userSettings = {
        language: localStorageUserSettings.language ? localStorageUserSettings.language : environment.defaultLanguage
      };
    }
    this.translateService.setDefaultLang(this.userSettings.language);
  }

  public getUserSettings(): UserSettings {
    return this.userSettings;
  }

  public saveUserSettings(newUserSettings: UserSettings): void {
    this.userSettings = newUserSettings;
    localStorage.setItem('userSettings', JSON.stringify(newUserSettings));
    this.translateService.use(newUserSettings.language);
  }

}
