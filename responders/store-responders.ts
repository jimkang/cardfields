import {
  CollectionStoreType,
  StoreType,
  Thing,
  UIThing,
} from '../types';

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
