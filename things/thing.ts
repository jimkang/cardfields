export interface Thing {
  id: string;
  text?: string;
  title?: string;
  secretText?: string;
  picture?: string;
  tags: string[];
  color?: string;
}

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

export interface ThingConflictPair {
  id: string; // Only needs to be unique to the import.
  incumbent: Thing;
  challenger: Thing;
}
