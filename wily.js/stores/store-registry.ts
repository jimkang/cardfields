import type { CollectionStoreType, StoreType, Thing } from '../../types';
import { getCollectionStoreId } from '../stores/stores';

export function StoreRegistry() {
  var storesById: Record<string, StoreType<Thing>> = {};
  var collectionStoresById: Record<string, CollectionStoreType> = {};
  // TODO: Use this, make all CollectionStore construction use this.

  return {
    getStore,
    putStore,
    delStore,
    makeStoreHappen,
    getCollectionStore,
    putCollectionStore,
    delCollectionStore,
    makeCollectionStoreHappen,
  };

  function getStore(id: string): StoreType<Thing> {
    return storesById[id];
  }

  function makeStoreHappen(id: string, construct: () => StoreType<Thing>) {
    var store = getStore(id);
    if (store) {
      return store;
    }

    store = construct();
    putStore(store);
    return store;
  }

  function putStore(store: StoreType<Thing>): StoreType<Thing> {
    storesById[store.get().id] = store;
    return store;
  }

  function delStore(id: string): void {
    delete storesById[id];
  }

  function getCollectionStore(
    kind: string,
    parentThingId: string
  ): CollectionStoreType {
    return collectionStoresById[getCollectionStoreId(kind, parentThingId)];
  }

  function makeCollectionStoreHappen(
    kind: string,
    parentThingId: string,
    construct: () => CollectionStoreType
  ) {
    var collectionStore = getCollectionStore(kind, parentThingId);
    if (collectionStore) {
      return collectionStore;
    }

    collectionStore = construct();
    putCollectionStore(collectionStore);
    return collectionStore;
  }

  function putCollectionStore(store: CollectionStoreType): CollectionStoreType {
    collectionStoresById[
      getCollectionStoreId(store.kind, store.parentThingId)
    ] = store;
    return store;
  }

  function delCollectionStore(kind: string, parentThingId: string): void {
    delete storesById[getCollectionStoreId(kind, parentThingId)];
  }
}

export var storeRegistry = StoreRegistry();
