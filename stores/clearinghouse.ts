// (Intended) singleton that makes sure there is one ThingStore per Thing, at least for things that actually use this issuer. You can go outside of this if you want duplicate stores that are untracked.

import { writeThing, deleteThing, getIds, writeIds, getThing } from './local-storage';
import type { ThingStore, Profile, Thing } from '../types';
import { Store } from '../stores/store';
import { CollectionStore } from '../stores/collection-store';
import { profileIdsKey } from '../names';
import { initProfile } from '../init/init-profiles';

// TODO: If testing var is set, use mock storage.

export function Clearinghouse() {
  var storesById: Record<string, ThingStore<unknown>> = {};

  return {
    getStore,
    getCollectionStore,
    getThing,
    getThingsFromIds,
    createStoredThing
  };

  function getStore(kind: string, id: string, value?: unknown): ThingStore<unknown> {
    var store = storesById[id];
    if (!store) {
      if (!value) {
        value = getThing(id);
      }
      if (kind === 'profile') {
        store = Store<Profile>(writeThing, deleteThing, value as Profile);
      }
      if (store) {
        storesById[id] = store;
      }
    }
    return store;
  }

  function getCollectionStore(kind: string) {
    var store;
    if (kind === 'profile') {
      store = CollectionStore({ getIds, writeIds, collectionKey: profileIdsKey });
    }
    return store;
  }


  function getThingsFromIds(ids: string[]): Thing[] {
    return ids.map(getThing);
  }

  function createStoredThing(kind: string): ThingStore<unknown> {
    var thing: Thing;
    if (kind === 'profile') {
      thing = initProfile();
    }
    var collectionStore = getCollectionStore(kind);
    collectionStore.add(thing.id);
    var store = getStore(kind, thing.id);
    store.set(thing);
    return store;
  }
}

export var clearinghouse = Clearinghouse();
