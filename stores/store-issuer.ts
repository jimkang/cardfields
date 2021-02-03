// (Intended) singleton that makes sure there is one ThingStore per Thing, at least for things that actually use this issuer. You can go outside of this if you want duplicate stores that are untracked.
//import type { Writable } from 'svelte/store';
import type { Thing, ThingStore, StoreCtor, StoreIssuerType } from '../types';

export function StoreIssuer<ThingType, StoreT extends ThingStore<ThingType>>(state, createStore: StoreCtor<ThingType, StoreT>): StoreIssuerType<ThingType, StoreT> {
  var storesById: Record<string, StoreT> = {};

  return {
    getStore,
    getStoreForId,
    removeWithId
  };

  function getStoreForId(id: string): StoreT {
    return storesById[id];
  }

  function getStore(thing: Thing): StoreT {
    if (!thing) {
      console.error(new Error('null thing passed to getStore.'));
      return;
    }

    var store = getStoreForId(thing.id);
    if (!store) {
      store = createStore(state, thing);
      storesById[thing.id] = store;
    }
    return store;
  }

  function removeWithId(id: string) {
    var thingStore = getStoreForId(id);
    thingStore.delete();
    delete storesById[id];
  }
}

