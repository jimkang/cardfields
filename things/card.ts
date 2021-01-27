import type { Thing } from './thing';
import { removeFromArray } from './thing';

export interface Card extends Omit<Thing, 'text'> {
  text: string;
  // TODO: History
}

export function removeCardFromList(list: Card[], card: Card): Card[] {
  removeFromArray(list, card);
  return list;
}
