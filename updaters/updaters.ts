import type { ThingStoreType, CollectionStoreType } from '../types';

export function UpdateProfile(render, collectionStore: CollectionStoreType, activeProfileStore: ThingStoreType, store: ThingStoreType) {
  store.subscribe(update);
  activeProfileStore.subscribe(update);

  return update;

  function update() {
    render(collectionStore, store, activeProfileStore);
  }
}
