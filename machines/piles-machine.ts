import { ThingStoreType, Persister, Thing, CollectionStoreType, Pile } from '../types';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnPileChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { PilesPersister } from '../persisters/piles-persister';
import { v4 as uuid } from 'uuid';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';

export function assemblePilesMachine({
  parentStore,
}: {
    parentStore: ThingStoreType;
},
) {
  // Persister
  var idsPersister: Persister = PilesPersister(parentStore);

  // CollectionStore.
  var collectionStore = registry.makeCollectionStoreHappen('pile', null, () =>
    CollectionStore({
      idsPersister,
      thingPersister,
      kind: 'pile',
      parentThingId: parentStore.get().id,
      vals: parentStore.get().piles,
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
    createNewPile,
    thingPersister,
    curry(OnPileChange)(RenderPile(), collectionStore, parentStore),
    registry
  );

  // Renderer.
  var renderCollection = RenderPileCollection({
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
    return OnPileChange(
      RenderPile(),
      collectionStore,
      containingItemStore,
      store
    );
  }
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}
