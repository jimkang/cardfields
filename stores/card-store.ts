import { writable, get } from 'svelte/store';
import type { Card } from '../things/card';
import { getCardKey } from '../things/card';

export default function CardStore(card: Card) {
  var store = writable(card);
  return {
    set(value) {
      console.log('Setting', value);
      localStorage.setItem(getCardKey(value), JSON.stringify(value));
      store.set(value);
    },
    // Takes a callback that returns a (possibly)
    // transformed value to set the store to.
    // Svelte is OK with it calling back on the same
    // tick as this call, according to the docs'
    // example.
    update(cb) {
      console.log('updating');
      // Just passing through right now.
      cb(get(store));
    },
    subscribe: store.subscribe
  };
}

