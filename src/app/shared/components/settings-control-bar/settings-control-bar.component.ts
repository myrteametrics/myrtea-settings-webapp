import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';

@Component({
  selector: 'app-settings-control-bar',
  templateUrl: './settings-control-bar.component.html',
  styleUrls: ['./settings-control-bar.component.scss']
})
export class SettingsControlBarComponent {

  public icons = Icons;

  public isModified: boolean;

  @Input() controlTitle: string;
  @Input() noMoreOptions: boolean;
  @Input() set updateModifiedState(m: boolean) { this.isModified = m; }

  @Output() public save = new EventEmitter();
  @Output() public delete = new EventEmitter();
  @Output() public cancel = new EventEmitter();
  @Output() public return = new EventEmitter();

  constructor() { }

  public onReturn() {
    this.return.emit();
  }

  public onCancel() {
    this.cancel.emit();
  }

  public onSave() {
    this.save.emit();
  }

  public onDelete() {
    this.delete.emit();
  }

}
