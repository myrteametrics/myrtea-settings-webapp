import { Resource } from '../../shared/models/resource';


export interface Models {
  [key: number]: ModelDefinition;
}

export interface ModelDefinition extends Resource {
  name: string;
  synonyms: string[];
  fields: (ModelObjectField | ModelField)[];
  elasticsearchOptions: ModelElasticsearchOptions;
}

export interface ModelElasticsearchOptions {
  rollcron: string;
  rollmode: string;
  enablePurge: boolean;
  patchAliasMaxIndices: number;
  purgeMaxConcurrentIndices: number;
  advancedSettings?: AdvancedSettings;
}

export interface AdvancedSettings {
  [key: string]: any;
}

export interface ModelField {
  name: string;
  type: ModelFieldType;
  synonyms: string[];
}

export interface ModelObjectField {
  name: string;
  type: ModelFieldType.Object; // optionnal because always object ?
  keepObjectSeparation: boolean;
  fields: (ModelObjectField | ModelField)[];
}

export enum ModelFieldType {
  Object = 'object',
  String = 'string',
  Integer = 'int',
  Float = 'float',
  Boolean = 'boolean',
  Datetime = 'datetime',
  Script = 'script'
}

export function flattenModelFields(model: ModelDefinition): (ModelObjectField | ModelField)[] {
  if (!model) {
    return [];
  }
  return flattenFields(undefined, model.fields);
}

function flattenFields(
  parent: (ModelObjectField | ModelField),
  fields: (ModelObjectField | ModelField)[]): (ModelObjectField | ModelField)[] {

  let result = [];
  if (fields) {
    fields.forEach(field => {
      const newField = { ...field }; // Keep this shallow copy to not alter original model fields
      if (parent) {
        newField.name = parent.name + '.' + newField.name;
      }
      if ((newField as ModelObjectField).fields) {
        result = result.concat(flattenFields(newField, (newField as ModelObjectField).fields));
      } else {
        result.push(newField);
      }
    });
  }
  return result;
}
