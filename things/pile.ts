import type { Thing } from './thing';
import type { Card } from './card';

export interface Pile extends Omit<Thing, 'title'> {
  title: string;
  cards: Card[];
}
