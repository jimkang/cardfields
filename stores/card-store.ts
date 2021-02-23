import { writable } from 'svelte/store';
import type { Card, CardStoreType } from '../types';

// Profiles don't apply here. They are collections
// of piles and settings.
export default function CardStore(writeThing, deleteThing, card): CardStoreType {
  var store = writable(card);

  return {
    set(value: Card) {
      console.log('Setting', value);
      writeThing(value);
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
      deleteThing(card.id);
    },
  };
}

