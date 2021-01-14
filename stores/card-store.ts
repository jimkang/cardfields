import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Card } from '../things/card';

export interface CardStoreType extends Writable<Card> {
  delete: () => void;
}

export default function CardStore(state, card): CardStoreType {
  var store = writable(card);

  return {
    set(value: Card) {
      console.log('Setting', value);
      state.persistCard(value);
      store.set(value);
      card = value;
    },
    // Takes a callback that returns a (possibly)
    // transformed value to set the store to.
    // Svelte is OK with it calling back on the same
    // tick as this call, according to the docs'
    // example.
    //update(cb) {
    //console.log('updating');
    //// Just passing through right now.
    //cb(get(store));
    //},
    update: store.update,
    subscribe: store.subscribe,
    delete() {
      state.deleteCard(card.id);
    }
  };
}

