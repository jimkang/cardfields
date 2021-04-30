import type { CollectionStoreType, StoreType, Thing } from '../../types';

export function OnThingChange(
  render,
  collectionStore: CollectionStoreType,
  store: StoreType<Thing>
) {
  store.subscribe(onThingChange);

  return onThingChange;

  function onThingChange(store: StoreType<Thing>) {
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
