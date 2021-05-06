import {
  CollectionStoreType,
  Deck,
  Pile,
  StoreType,
  Thing,
  UIThing,
} from '../types';

export function OnDeckChange({
  render,
  renderCollection,
  collectionStore,
  activeDeckStore,
  store,
}: {
  render;
  renderCollection;
  collectionStore: CollectionStoreType;
  activeDeckStore: StoreType<Thing>;
  store: StoreType<Deck>;
}) {
  store.subscribe(onDeckChange);
  activeDeckStore.subscribe(onDeckChange);

  return onDeckChange;

  function onDeckChange() {
    if (store.isDeleted()) {
      renderCollection(collectionStore);
      return;
    }

    render(collectionStore, store, activeDeckStore);
  }
}

// TODO: Generic OnThingChange.
export function OnPileChange({
  render,
  renderCollection,
  collectionStore,
  deckStore,
  pileStore,
}: {
  render;
  renderCollection;
  collectionStore: CollectionStoreType;
  deckStore: StoreType<Deck>;
  pileStore: StoreType<Pile>;
}) {
  pileStore.subscribe(onPileChange);

  return onPileChange;

  function onPileChange(store: StoreType<Thing>) {
    if (store.isDeleted()) {
      renderCollection(collectionStore);
      return;
    }

    render(collectionStore, deckStore, store);
  }
}

export function OnThingChange({
  render,
  collectionStore,
  thingStore,
}: {
  render;
  collectionStore: CollectionStoreType;
  thingStore: StoreType<Thing>;
}) {
  thingStore.subscribe(onThingChange);

  return onThingChange;

  function onThingChange() {
    var thing: UIThing = thingStore.get();
    // TODO: Stop accepting undefined once existing data is upgraded.
    if (thing.visible === true || thing.visible === undefined) {
      render(collectionStore, thingStore);
    }
  }
}
