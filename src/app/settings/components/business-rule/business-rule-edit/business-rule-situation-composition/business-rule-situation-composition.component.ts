import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SituationService } from 'src/app/settings/services/situation.service';
import { SituationDefinition } from 'src/app/settings/interfaces/situation';
import { InputWithSuggestionsData } from 'src/app/shared/models/input-with-suggestions';
import { Icons } from 'src/app/shared/constants/icons';
import { BubblesListingData, BubblesListingElement } from 'src/app/shared/models/bubbles-listing';
import { MatDialog } from '@angular/material';
import { MultipleSelectionPopUpComponent } from 'src/app/shared/components/multiple-selection-pop-up/multiple-selection-pop-up.component';
import { MultipleSelectionElement } from 'src/app/shared/models/multiple-selection';
import { BusinessRuleEditService } from 'src/app/settings/components/business-rule/business-rule-edit/business-rule-edit.service';

@Component({
  selector: 'app-business-rule-situation-composition',
  templateUrl: './business-rule-situation-composition.component.html',
  styleUrls: ['./business-rule-situation-composition.component.scss']
})
export class BusinessRuleSituationCompositionComponent implements OnInit {

  private situations: SituationDefinition[];
  private situationsInRule: SituationDefinition[];
  public icons = Icons;
  public situationsWithSuggestions: InputWithSuggestionsData = {
    label: 'settings.situation.component.addelement.add',
    elements: []
  };
  public situationListingData: BubblesListingData = { elements: [] };
  public removeSituationEmitter = new EventEmitter<number>();
  @Output() isDirtyEmitter = new EventEmitter<boolean>();
  @Input() creationMode: boolean;

  constructor(
    private situationService: SituationService,
    private dialog: MatDialog,
    private businessRuleEditService: BusinessRuleEditService
  ) { }

  ngOnInit() {
    this.removeSituationEmitter.subscribe((situationId: number) => this.removeSituation(situationId));
    this.fetchSituations();
  }

  public resetSitutations() {
    this.fetchSituationsInRule();
  }

  private fetchSituations() {
    this.situationService.list().subscribe((situations: SituationDefinition[]) => {
      this.situations = situations;
      if (this.businessRuleEditService.creationMode) {
        this.situationsInRule = situations;
        return;
      }
      this.fetchSituationsInRule();
    });
  }

  private fetchSituationsInRule() {
    this.businessRuleEditService.getSituationsInCurrentRule().subscribe((situations: SituationDefinition[]) => {
      this.situationsInRule = situations;
      const bubblesSituation: BubblesListingElement[] = this.situationsInRule
        .map((situation: SituationDefinition) => this.transformSituationInBubbleElement(situation));
      this.situationListingData = { elements: bubblesSituation };
      this.insertSituationsInSuggestions();
    });
  }

  private transformSituationInBubbleElement(situation: SituationDefinition): BubblesListingElement {
    return {
      text: situation.name,
      id: situation.id,
      click: this.removeSituationEmitter
    };
  }

  public getSituationsId(): number[] {
    const situationsId = [];
    this.situationListingData.elements.map((situationBubble: BubblesListingElement) => {
      situationsId.push(situationBubble.id);
    });
    return situationsId;
  }

  private situationsIsInRule(situationId: number): boolean {
    return this.situationListingData.elements
      .findIndex((situationBubble: BubblesListingElement) => situationBubble.id === situationId) !== -1;
  }

  private insertSituationsInSuggestions() {
    this.situationsWithSuggestions.elements = this.situations
      .filter((situation: SituationDefinition) => !this.situationsIsInRule(situation.id))
      .map((situation: SituationDefinition) => {
        return {
          objectId: situation.id,
          content: situation.name
        };
      });
  }

  public addSituation(situationId: number) {
    const situationToAdd: SituationDefinition = this.situations.find((situation: SituationDefinition) => situationId === situation.id);
    this.situationListingData.elements.push(this.transformSituationInBubbleElement(situationToAdd));
    this.isDirtyEmitter.emit(true);
    this.insertSituationsInSuggestions();
  }

  public removeSituation(situationId: number) {
    this.situationListingData.elements = this.situationListingData.elements
      .filter((bubbleElement: BubblesListingElement) => situationId !== bubbleElement.id);
    this.isDirtyEmitter.emit(true);
    this.insertSituationsInSuggestions();
  }

  public displayMultipleSituationSelection() {
    this.dialog.open(MultipleSelectionPopUpComponent, {
      width: '50%',
      height: '50vh',
      data: {
        title: 'settings.situation.component.addelement.add',
        search: 'settings.situation.component.addelement.search',
        selected: 'settings.situation.component.addelement.selected',
        elements: this.situations
          .filter((situation: SituationDefinition) => !this.situationsIsInRule(situation.id))
          .map((situation: SituationDefinition): MultipleSelectionElement => {
            return {
              name: situation.name,
              id: situation.id
            };
          })
      }
    }).afterClosed().subscribe((elements: MultipleSelectionElement[]) => {
      if (!elements) { return; }
      elements.forEach((element: MultipleSelectionElement) => this.addSituation(element.id));
    });
  }

}
