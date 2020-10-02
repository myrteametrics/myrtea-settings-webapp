import { Component, OnInit, OnDestroy } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/header/services/header.service';
import { AdministrationState } from 'src/app/administration/interfaces/administration-state';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy {

  public icons = Icons;
  public currentState: AdministrationState;
  public administrationState = AdministrationState;

  constructor(
    private headerService: HeaderService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.currentState = this.route.snapshot.data.state;
    this.headerService.changeTitle('settings.title.administration');
  }

  ngOnDestroy() {
    this.headerService.changeTitle('');
  }

}
