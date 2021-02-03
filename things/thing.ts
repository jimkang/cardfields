import type { Thing } from '../types';

// Returns true if it actually removed the thing.
export function removeFromArrayById(array: Thing[], id: string): boolean {
  const index = array.findIndex(listThing => listThing.id === id);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
}

// Returns true if it actually removed the thing.
export function removeFromArray(array: Thing[], thing: Thing): boolean {
  return removeFromArrayById(array, thing.id);
}
