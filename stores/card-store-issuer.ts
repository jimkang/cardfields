// (Intended) singleton that makes sure there is one CardStore per Card, at least for things that actually use this issuer. You can go outside of this if you want duplicate stores that are untracked.

import type { Card } from '../things/card';
import CardStore from './card-store';
import type { CardStoreType } from './card-store';

export function CardStoreIssuer(state) {
  var storesById: Record<string, CardStoreType> = {};

  return {
    getCardStore,
    getCardStoreForId,
    removeCardWithId
  };

  function getCardStoreForId(id: string): CardStoreType {
    return storesById[id];
  }

  function getCardStore(card: Card): CardStoreType {
    var store = getCardStoreForId(card.id);
    if (!store) {
      store = CardStore(state, card);
      storesById[card.id] = store;
    }
    return store;
  }

  function removeCardWithId(id: string) {
    var cardStore = getCardStoreForId(id);
    cardStore.delete();
    delete storesById[id];
  }
}

