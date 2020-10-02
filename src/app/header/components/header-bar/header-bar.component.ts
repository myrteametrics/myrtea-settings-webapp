import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  public title = '';
  public isVisible = true;
  public logo = environment.clientLogo;

  constructor(
    private headerService: HeaderService
  ) {
  }

  ngOnInit() {
    this.headerService.titleEmitter.subscribe((title: string) => this.title = title);
    this.headerService.hiddeEmitter.subscribe((visible: boolean) => this.isVisible = visible);
  }

}
