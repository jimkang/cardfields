import { ThingStore } from '../stores';

export function AddThing(
  collectionStore,
  createNewThing,
  thingPersister,
  createItemUpdater
) {
  return addThing;

  function addThing() {
    var newStore = ThingStore(thingPersister, createNewThing());
    // We need to wait for the thing to be registered
    // in the collection before we set up an updater
    // for it because we want it to trigger a render
    // of the container for the thing before we
    // potentially render the thing itself.
    collectionStore.subscribe(setUpUpdaterForStore);
    collectionStore.add(newStore.get());

    function setUpUpdaterForStore() {
      var newUpdater = createItemUpdater(newStore);
      newUpdater(newStore);
      collectionStore.unsubscribe(setUpUpdaterForStore);
    }
  }
}
