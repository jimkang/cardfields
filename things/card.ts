import type { Card } from '../types';
import { removeFromArray } from './thing';

export function removeCardFromList(list: Card[], card: Card): Card[] {
  removeFromArray(list, card);
  return list;
}
