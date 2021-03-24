import type { ThingStoreType, CollectionStoreType } from '../types';

export function OnDeckChange(
  render,
  collectionStore: CollectionStoreType,
  activeDeckStore: ThingStoreType,
  store: ThingStoreType
) {
  store.subscribe(onDeckChange);
  activeDeckStore.subscribe(onDeckChange);

  return onDeckChange;

  function onDeckChange() {
    render(collectionStore, store, activeDeckStore);
  }
}

export function OnPileChange(
  render,
  collectionStore: CollectionStoreType,
  deckStore: ThingStoreType,
  pileStore: ThingStoreType
) {
  pileStore.subscribe(onPileChange);

  return onPileChange;

  function onPileChange() {
    render(collectionStore, deckStore, pileStore);
  }
}
