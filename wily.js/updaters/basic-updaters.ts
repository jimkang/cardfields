import type { ThingStoreType, CollectionStoreType } from '../../types';

export function Update(render, collectionStore: CollectionStoreType, store: ThingStoreType) {
  var render = Render({ parentSelector: `#${store.get().id}` });
  store.subscribe(update);

  return update;

  function update(store: ThingStoreType) {
    render(collectionStore, store);
  }
}

export function UpdateCollection(collectionStore: CollectionStoreType, ItemUpdate, ItemRender, renderCollection) {
  var itemUpdates;

  collectionStore.subscribe(updateCollection);

  return updateCollection;

  function updateCollection(collectionStore: CollectionStoreType) {
    renderCollection(collectionStore);

    var itemStores = collectionStore.get().map(thing => ThingStore(thingPersister, thing));
    itemUpdates = itemStores.map(curry(ItemUpdate)(ItemRender({ parentSelector: `#${store.get().id}` }), collectionStore));
;
    itemUpdates.forEach((update, i) => update(itemStores[i]));
  }
}


