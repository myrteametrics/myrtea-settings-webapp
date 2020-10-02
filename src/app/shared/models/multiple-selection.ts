export interface MultipleSelectionData {
  title: string;
  search: string;
  selected: string;
  elements: MultipleSelectionElement[];
}

export interface MultipleSelectionElement {
  id: number;
  name: string;
  icon?: string;
}
