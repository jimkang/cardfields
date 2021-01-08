import { writable } from 'svelte/store';
import type { Card } from '../things/card';
import { getCardKeyFromId } from '../things/card';
import pluck from 'lodash.pluck';

const idIndexKey = 'ids__cards';     

export default function AllCardsStore(initCards?: Card[]) {
  var cards = initCards;
  if (!cards) {
    const ids = localStorage.getItem(idIndexKey);
    if (ids && ids.length > 0) {
      cards = ids.split(',').map(getCardFromLocalStorage);
    }
  }
  if (!cards) {
    cards = [];
  }
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
      saveIdsToLocalStorage(cards);
      set(cards);
    }
  };
}

// TODO: Validate?
function getCardFromLocalStorage(id: string): Card {
  // TODO: Safe parse
  return JSON.parse(localStorage.getItem(getCardKeyFromId(id)));
}

function saveIdsToLocalStorage(cards: Card[]) {
  localStorage.setItem(idIndexKey, pluck(cards, 'id').join(','));
}

