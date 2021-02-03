import { writable } from 'svelte/store';
import type { Card, CardStoreType, StoreIssuerType } from '../types';
import compact from 'lodash.compact';

export default function CardStore(state, card): CardStoreType {
  var store = writable(card);

  return {
    set(value: Card) {
      console.log('Setting', value);
      state.persistThing(value);
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

export function getCardStores(cardStoreIssuer: StoreIssuerType<Card, CardStoreType>, cards: Card[]): CardStoreType[] {
  var stores: CardStoreType[] = compact(cards.map(cardStoreIssuer.getStore));
  //console.log('stores', stores);
  return stores;
}

