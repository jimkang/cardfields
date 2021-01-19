import type { Thing } from './thing';
import type { Card } from './card';
import curry from 'lodash.curry';

export interface Pile extends Omit<Thing, 'title'> {
  title: string;
  cards: Card[];
}

export function rehydratePile(allCards: Card[], deserializedButRaw): Pile {
  var rehydrated: Pile = Object.assign({}, deserializedButRaw);
  rehydrated.cards = deserializedButRaw.cards.map(curry(getActualCard)(allCards));
  return rehydrated;
}

function getActualCard(allCards: Card[], id: string) {
  return allCards.find(card => card.id === id);
}
