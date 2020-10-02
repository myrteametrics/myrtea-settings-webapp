import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/services/header.service';
import { SettingsState } from 'src/app/settings/interfaces/states/settings-state';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public currentState: SettingsState;
  public settingsState = SettingsState;

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentState = this.route.snapshot.data.state;
    this.headerService.changeTitle('settings.title.settings');
  }

}
