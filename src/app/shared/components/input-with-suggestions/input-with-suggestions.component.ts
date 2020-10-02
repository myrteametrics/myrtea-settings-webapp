import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { InputWithSuggestionsData, InputWithSuggestionsElement } from '../../models/input-with-suggestions';

export interface DataSuggestions {
  label: string;
  elements: { icon: string, content: string, id: string }[];
}

@Component({
  selector: 'app-input-with-suggestions',
  templateUrl: './input-with-suggestions.component.html',
  styleUrls: ['./input-with-suggestions.component.scss']
})
export class InputWithSuggestionsComponent implements OnInit {

  @Input() data: InputWithSuggestionsData;
  @Output() selectEmitter = new EventEmitter<number>();
  @ViewChild('userInput', { static: false }) userInput: ElementRef;
  public suggestionVisibility = true;
  public suggestions: InputWithSuggestionsElement[] = [];

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.hideSuggestions();
    }
  }

  constructor(
    private eRef: ElementRef
  ) { }

  ngOnInit() {
  }

  public onSelect(objectId: number) {
    this.hideSuggestions();
    this.userInput.nativeElement.value = '';
    this.selectEmitter.emit(objectId);
  }

  public userInputChange() {
    const currentInput = this.userInput.nativeElement.value;
    if (currentInput.length === 0) {
      this.suggestionVisibility = false;
      return;
    }
    this.suggestions = this.data.elements.filter((element) => element.content.includes(currentInput));
    this.suggestionVisibility = true;
  }

  public hideSuggestions() {
    this.suggestionVisibility = false;
  }

}
