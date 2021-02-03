import { writable } from 'svelte/store';
import type { Pile, Card, PileStoreType } from '../types';
import { removeFromArray } from '../things/thing';

export default function PileStore(state, pile): PileStoreType {
  var store = writable(pile);

  function set(value: Pile) {
    console.log('Setting', value);
    state.persistPile(value);
    store.set(value);
    pile = value;
  }

  return {
    set,
    update: store.update,
    subscribe: store.subscribe,
    delete() {
      state.deletePile(pile.id);
    },
    addCard(card: Card) {
      pile.cards.push(card);
      set(pile);
    },
    removeCard(card: Card) {
      removeFromArray(pile.cards, card);
      set(pile);
    }
  };
}

