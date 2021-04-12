import type { ThingStoreType, CollectionStoreType } from '../types';

export function OnDeckChange({
  render,
  collectionStore,
  activeDeckStore,
  store,
}: {
  render;
  collectionStore: CollectionStoreType;
  activeDeckStore: ThingStoreType;
  store: ThingStoreType;
}) {
  store.subscribe(onDeckChange);
  activeDeckStore.subscribe(onDeckChange);

  return onDeckChange;

  function onDeckChange() {
    render(collectionStore, store, activeDeckStore);
  }
}

// TODO: Generic OnThingChange.
export function OnPileChange({
  render,
  collectionStore,
  deckStore,
  pileStore,
}: {
  render;
  collectionStore: CollectionStoreType;
  deckStore: ThingStoreType;
  pileStore: ThingStoreType;
}) {
  pileStore.subscribe(onPileChange);

  return onPileChange;

  function onPileChange() {
    render(collectionStore, deckStore, pileStore);
  }
}

export function OnCardChange({
  render,
  collectionStore,
  pileStore,
  cardStore,
}: {
  render;
  collectionStore: CollectionStoreType;
  pileStore: ThingStoreType;
  cardStore: ThingStoreType;
}) {
  cardStore.subscribe(onCardChange);

  return onCardChange;

  function onCardChange() {
    render(collectionStore, pileStore, cardStore);
  }
}
