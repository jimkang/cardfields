import type { Thing } from './thing';

export interface Card extends Omit<Thing, 'text'> {
  text: string;
  // TODO: History
}

export function removeCardFromList(list: Card[], card: Card): Card[] {
  const index = list.findIndex(listCard => listCard.id === card.id);
  if (index > -1) {
    list.splice(index, 1);
  }
  return list;
}

export interface CardConflictPair {
  id: string; // Only needs to be unique to the import.
  incumbent: Card;
  challenger: Card;
}
