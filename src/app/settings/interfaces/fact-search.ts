export interface FactSearch {
  time: string;
  nhit?: number;
  situationId?: string;
  offset?: number;
  situationInstanceId?: string;
  debug?: string;
}

export interface FactHits {
  hits: Hit[];
  aggregates: {
    aggs: {
      doc_count: {
        value: number;
      }
    }
  };
}

export interface Hit {
  id: string;
  fields: {
    [key: string]: string;
  };
}
