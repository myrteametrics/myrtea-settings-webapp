export const ACTIONS_TYPE: ActionType[] = [
  {
    name: 'set',
    keys: []
  },
  {
    name: 'create-issue',
    keys: ['id', 'level', 'timeout', 'isNotification']
  },
  {
    name: 'close-today-issues',
    keys: ['id', 'timezone']
  },
  {
    name: 'notify',
    keys: ['id', 'level', 'description', 'timeout']
  }
];

export interface ActionType {
  name: string;
  keys: string[];
}
