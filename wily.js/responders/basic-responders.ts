import type { ThingStoreType, CollectionStoreType } from '../../types';

export function OnThingChange(
  render,
  collectionStore: CollectionStoreType,
  store: ThingStoreType
) {
  store.subscribe(onThingChange);

  return onThingChange;

  function onThingChange(store: ThingStoreType) {
    render(collectionStore, store);
  }
}

export function OnCollectionChange(
  renderCollection,
  collectionStore: CollectionStoreType
) {
  collectionStore.subscribe(onCollectionChange);

  return onCollectionChange;

  function onCollectionChange(collectionStore: CollectionStoreType) {
    renderCollection(collectionStore);
  }
}
