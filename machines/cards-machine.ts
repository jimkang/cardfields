import {
  ThingStoreType,
  Persister,
  Thing,
  CollectionStoreType,
  Card,
} from '../types';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnCardChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { PiggybackPersister } from '../persisters/piggyback-persister';
import { v4 as uuid } from 'uuid';
import { RenderCard, RenderCardCollection } from '../renderers/card-renderers';

export function assembleCardsMachine({
  parentStore,
}: {
  parentStore: ThingStoreType;
}) {
  // Persister
  var idsPersister: Persister = PiggybackPersister(parentStore, 'cards');

  // CollectionStore.
  var collectionStore = registry.makeCollectionStoreHappen('card', null, () =>
    CollectionStore({
      idsPersister,
      thingPersister,
      kind: 'card',
      parentThingId: parentStore.get().id,
      vals: parentStore.get().cards,
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
  var addThing = AddThing({
    collectionStore,
    createNewThing: createNewCard,
    thingPersister,
    createItemResponder: onItemChangeMapper,
    storeRegistry: registry,
  });

  // Renderer.
  var renderCollection = RenderCardCollection({
    parentSelector: `#${parentStore.get().id} .card-collection-container`,
    addThing,
  });

  // Responder.
  var onCollectionChange = OnCollectionChange(
    renderCollection,
    collectionStore
  );

  // Init containers.
  onCollectionChange(collectionStore);

  // Item responders.
  var onItemChangeFns = itemStores.map(onItemChangeMapper);

  return { renderCollection, collectionStore, itemStores, onItemChangeFns };

  function onItemChangeMapper(store: ThingStoreType) {
    return OnCardChange({
      render: RenderCard(),
      collectionStore,
      pileStore: parentStore,
      cardStore: store,
    });
  }
}

function createNewCard(): Card {
  return { id: `card-${uuid()}`, title: 'New card', text: 'This is a card.' };
}
