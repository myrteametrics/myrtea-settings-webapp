import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Icons } from 'src/app/shared/constants/icons';
import { SecurityGroup } from 'src/app/administration/interfaces/security-group';
import { BubblesListingData, BubblesListingElement } from 'src/app/shared/models/bubbles-listing';
import { SecurityGroupService } from 'src/app/administration/services/security-group.service';
import { MatDialog } from '@angular/material';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';
import { InputWithSuggestionsData, InputWithSuggestionsElement } from 'src/app/shared/models/input-with-suggestions';

@Component({
  selector: 'app-security-group-composition',
  templateUrl: './security-group-composition.component.html',
  styleUrls: ['./security-group-composition.component.scss']
})
export class SecurityGroupCompositionComponent implements OnInit {

  public icons = Icons;
  private groups: SecurityGroup[];
  public listingGroupsData: BubblesListingData = { elements: [] };
  public groupsWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.group.component.addelement.add',
    elements: []
  };
  private removeGroupEmitter = new EventEmitter<number>();
  @Output() isDirtyEmitter = new EventEmitter<boolean>();
  @Input('groupIdsInElement') set setGroupIdsInElement(ids: number[]) {
    if (ids) {
      this.groupIdsInElement = ids;
    } else {
      this.groupIdsInElement = [];
    }
  }
  private groupIdsInElement: number[];

  constructor(
    private groupService: SecurityGroupService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.fetchGroups();
    this.removeGroupEmitter.subscribe((groupId: number) => this.removeGroup(groupId));
  }

  private fetchGroups() {
    this.groupService.list().subscribe((groups: SecurityGroup[]) => {
      this.groups = groups;
      this.insertBubblesElements();
      this.insertGroupInSuggestions(this.groups);
    });
  }

  private insertBubblesElements() {
    const bubblesGroup: BubblesListingElement[] = [];
    this.groupIdsInElement.forEach((groupId: number) => {
      const groupInElement = this.groups.find((group: SecurityGroup) => group.id === groupId);
      bubblesGroup.push(this.transformGroupToBubbleElement(groupInElement));
    });
    this.listingGroupsData.elements = bubblesGroup;
  }

  private insertGroupInSuggestions(groups: SecurityGroup[]) {
    this.groupsWithSuggestions.elements = groups
      .filter((group: SecurityGroup) => !this.groupIsInBubblesListing(group.id))
      .map((group: SecurityGroup) => this.transformGroupToSuggestions(group));
  }

  public displayMultipleGroupSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '40%',
      height: '50vh',
      data: {
        title: 'settings.group.component.addelement.add',
        search: 'settings.group.component.addelement.search',
        selected: 'settings.group.component.addelement.selected',
        elements: this.groups
          .filter((group: SecurityGroup) => !this.groupIsInBubblesListing(group.id))
          .map((group: SecurityGroup): MultipleSelectionElement => {
            return {
              name: group.name,
              id: group.id
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addGroup(element.id));
    });
  }

  private groupIsInBubblesListing(groupId: number): boolean {
    const indexGroup = this.listingGroupsData.elements
      .findIndex((bubbleElement: BubblesListingElement) => groupId === bubbleElement.id);
    return indexGroup !== -1;
  }

  private transformGroupToSuggestions(group: SecurityGroup): InputWithSuggestionsElement {
    return {
      objectId: group.id,
      content: group.name,
      icon: Icons.GROUP.name
    };
  }

  private transformGroupToBubbleElement(group: SecurityGroup): BubblesListingElement {
    return {
      text: group.name,
      id: group.id,
      click: this.removeGroupEmitter
    };
  }

  public addGroup(groupId: number) {
    this.isDirtyEmitter.emit(true);
    const groupToAdd = this.groups.find((group: SecurityGroup) => group.id === groupId);
    this.listingGroupsData.elements.push(this.transformGroupToBubbleElement(groupToAdd));
    this.groupsWithSuggestions.elements = this.groupsWithSuggestions.elements
      .filter((suggestion: InputWithSuggestionsElement) => suggestion.objectId !== groupId);
  }

  public removeGroup(groupId: number) {
    this.isDirtyEmitter.emit(true);
    const groupToRemove = this.groups.find((group: SecurityGroup) => group.id === groupId);
    this.listingGroupsData.elements = this.listingGroupsData.elements
      .filter((bubbleElement: BubblesListingElement) => groupId !== bubbleElement.id);
    this.groupsWithSuggestions.elements.push(this.transformGroupToSuggestions(groupToRemove));
  }

  public getGroupsInComposition(): number[] {
    return this.listingGroupsData.elements.map((bubbleElement: BubblesListingElement) => bubbleElement.id);
  }

  public reset() {
    this.insertBubblesElements();
    this.insertGroupInSuggestions(this.groups);
  }

}
