// (Intended) singleton that makes sure there is one ThingStore per Thing, at least for things that actually use this issuer. You can go outside of this if you want duplicate stores that are untracked.
//import type { Writable } from 'svelte/store';
import type { Thing } from '../things/thing';
import type { ThingStore } from './store-types';

type StoreCtor<T> = (object, T) => ThingStore<T>

export function StoreIssuer<ThingType>(state, createStore: StoreCtor<ThingType>) {

  var storesById: Record<string, ThingStore<ThingType>> = {};

  return {
    getStore,
    getStoreForId,
    removeWithId
  };

  function getStoreForId(id: string): ThingStore<ThingType> {
    return storesById[id];
  }

  function getStore(thing: Thing): ThingStore<ThingType> {
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

