export interface InputWithSuggestionsElement {
  icon?: string;
  content: string;
  objectId: number;
}

export interface InputWithSuggestionsData  {
  label: string;
  elements: InputWithSuggestionsElement[];
}
