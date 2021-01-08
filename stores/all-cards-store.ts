import { writable } from 'svelte/store';
import type { Card } from '../types';

export default function AllCardsStore(initCards: Card[]) {
  var cards = initCards;
  var store = writable(cards);

  function set(value) {
    console.log('Setting', value);
    store.set(value);
  }

  return {
    set,
    // Takes a callback that returns a (possibly)
    // transformed value to set the store to.
    // Svelte is OK with it calling back on the same
    // tick as this call, according to the docs'
    // example.
    update(cb) {
      console.log('updating');
      // Just passing through right now.
      cb(cards);
    },
    subscribe: store.subscribe,
    add(card: Card) {
      cards.push(card);
      set(cards);
    }
  };
}
