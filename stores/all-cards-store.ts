import { writable } from 'svelte/store';
import type { Card } from '../things/card';
import { getCardKeyFromId } from '../things/card';
import pluck from 'lodash.pluck';
import compact from 'lodash.compact';

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
  cards = compact(cards);
  var store = writable(cards);

  function set(value) {
    console.log('Setting', value);
    store.set(value);
  }

  function persist() {
    saveIdsToLocalStorage(cards);
    set(cards);
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
      persist();
    },
    del(id: string) {
      const index = cards.findIndex(c => c.id === id);
      if (index < 0) {
        console.error(new Error('del cannot find ' + id));
        return;
      }

      cards.splice(index, 1);
      persist();
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

