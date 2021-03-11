import type { ThingStoreType, CollectionStoreType } from '../types';

export function UpdateDeck(
  render,
  collectionStore: CollectionStoreType,
  activeDeckStore: ThingStoreType,
  store: ThingStoreType
) {
  store.subscribe(update);
  activeDeckStore.subscribe(update);

  return update;

  function update() {
    render(collectionStore, store, activeDeckStore);
  }
}

export function UpdatePile(
  render,
  collectionStore: CollectionStoreType,
  deckStore: ThingStoreType,
  pileStore: ThingStoreType
) {
  pileStore.subscribe(update);

  return update;

  function update() {
    render(collectionStore, deckStore, pileStore);
  }
}
