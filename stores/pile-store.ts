import { writable } from 'svelte/store';
import type { Pile } from '../things/pile';
import type { Card } from '../things/card';
import type { ThingStore } from './store-types';

export interface PileStoreType extends ThingStore<Pile> {
  delete: () => void;
  addCard: (card: Card) => void;
}

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
    }
  };
}

