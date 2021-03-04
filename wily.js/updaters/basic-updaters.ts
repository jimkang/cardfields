import type { ThingStoreType, CollectionStoreType } from '../../types';

// This takes input and updates stores.
export function Update(render, collectionStore: CollectionStoreType, store: ThingStoreType) {
  store.subscribe(update);

  return update;

  function update(store: ThingStoreType) {
    render(collectionStore, store);
  }
}

export function UpdateCollection(renderCollection, collectionStore: CollectionStoreType) {

  collectionStore.subscribe(updateCollection);

  return updateCollection;

  function updateCollection(collectionStore: CollectionStoreType) {
    renderCollection(collectionStore);
  }
}

