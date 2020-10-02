import { Directive, OnInit, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { Permission } from '@shared/models/permission';

@Directive({
  selector: '[appHasRight]'
})
export class HasRightDirective implements OnInit {

  @Input('appHasRight') set setRight(permission: Permission) {
    this.authService.userHasRight(permission).subscribe((right: boolean) => {
      right ?
        this.viewContainer.createEmbeddedView(this.templateRef) :
        this.viewContainer.clear();
    });
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) { }

  ngOnInit() { }

}
