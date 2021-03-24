import { ThingStore } from '../stores/stores';

export function AddThing(
  collectionStore,
  createNewThing,
  thingPersister,
  createItemResponder,
  storeRegistry
) {
  return addThing;

  function addThing() {
    var newStore = ThingStore(thingPersister, createNewThing());
    if (storeRegistry) {
      storeRegistry.putStore(newStore);
    }

    // We need to wait for the thing to be registered
    // in the collection before we set up an updater
    // for it because we want it to trigger a render
    // of the container for the thing before we
    // potentially render the thing itself.
    collectionStore.subscribe(setUpResponderForStore);
    collectionStore.add(newStore.get());

    function setUpResponderForStore() {
      var newResponder = createItemResponder(newStore);
      // Trigger the initial render of the new thing.
      newResponder(newStore);
      collectionStore.unsubscribe(setUpResponderForStore);
    }
  }
}
