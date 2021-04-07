import { ThingStoreType, Persister, Thing, CollectionStoreType } from '../types';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';

export function assembleSubMachine({
  parentStore,
  CollectionPersister,
  kind,
  createNewThing,
  RenderCollection,
  RenderItem,
  ItemChangeResponder,
  parentThingId,
  itemRehydrate
}: {
  parentStore: ThingStoreType;
  CollectionPersister: (parentStore: ThingStoreType) => Persister;
  kind: string;
  createNewThing;
  RenderCollection;
  RenderItem;
    ItemChangeResponder;
    parentThingId?: string;
    itemRehydrate?: (val: any) => Thing;
},
) {
  // Persister.
  var idsPersister: Persister = CollectionPersister(parentStore);

  // CollectionStore.
  var collectionStore = registry.makeCollectionStoreHappen('pile', null, () =>
    CollectionStore({
      idsPersister,
      thingPersister,
      kind,
      parentThingId,
      vals: parentStore.get()[`${kind}s`],
      itemRehydrate
    })
  );

  // Item stores.
  var itemStores = collectionStore
    .get()
    .map((thing: Thing) =>
      registry.makeStoreHappen(thing.id, () =>
        ThingStore(thingPersister, thing)
      )
    );

  // Updater.
  var addThing = AddThing(
    collectionStore,
    createNewThing,
    thingPersister,
    curry(ItemChangeResponder)(RenderItem(), collectionStore, parentStore),
    registry
  );

  // Renderer.
  var renderCollection = RenderCollection({
    parentSelector: `#${parentStore.get().id} .pile-collection-container`,
    addThing
  });

  // Responder.
  var onCollectionChange = OnCollectionChange(
    renderCollection,
    collectionStore
  );

  // Init containers.
  onCollectionChange(collectionStore);

  return { renderCollection, collectionStore, itemStores, onItemChangeMapper };

  function onItemChangeMapper(
    collectionStore: CollectionStoreType,
    containingItemStore: ThingStoreType,
    store: ThingStoreType
  ) {
    return ItemChangeResponder(
      RenderItem(),
      collectionStore,
      containingItemStore,
      store
    );
  }
}