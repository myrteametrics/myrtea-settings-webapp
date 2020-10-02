import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Icons } from '../constants/icons';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) { }

  public setIconsRegistry() {
    Object.values(Icons).forEach(icon => {
      this.matIconRegistry
        .addSvgIcon(
          icon.name,
          this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path)
        );
    });
  }
}
