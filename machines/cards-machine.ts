import { Persister, Thing, Card, StoreType, Pile, CollectionStoreType } from '../types';
import { CollectionStore, Store } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnCardChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { PiggybackPersister } from '../persisters/piggyback-persister';
import { v4 as uuid } from 'uuid';
import { RenderCard, RenderCardCollection } from '../renderers/card-renderers';
import curry from 'lodash.curry';

export function assembleCardsMachine({
  parentStore,
  pilesStore,
}: {
  parentStore: StoreType<Thing>;
    pilesStore: CollectionStoreType;
}) {
  // Persister
  var idsPersister: Persister = PiggybackPersister(parentStore, 'cards');

  const parentThingId = parentStore.get().id;
  // CollectionStore.
  var collectionStore = registry.makeCollectionStoreHappen(
    'card',
    parentThingId,
    () =>
      CollectionStore({
        idsPersister,
        thingPersister,
        kind: 'card',
        parentThingId,
        vals: (parentStore.getRaw() as Pile).cards,
        alreadyPersisted: true,
        initValIsAlreadyDehydrated: true,
      })
  );

  // Item stores.
  var itemStores = collectionStore.get().map(curry(createStoreForCard)(false));

  // Updater.
  var addThing = AddThing({
    collectionStore,
    createNewThingInStore: () => createStoreForCard(true, createNewCard()),
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

  function onItemChangeMapper(store: StoreType<Thing>) {
    return OnCardChange({
      render: RenderCard(),
      collectionStore,
      pileStore: parentStore,
      pilesStore,
      cardStore: store,
    });
  }
}

function createStoreForCard(isNew: boolean, card: Card) {
  //console.log('registry', registry);
  return registry.makeStoreHappen(card.id, () =>
    Store<Thing>(thingPersister, card, null, null, !isNew, false)
  );
}

function createNewCard(): Card {
  return { id: `card-${uuid()}`, title: 'New card', text: 'This is a card.' };
}
