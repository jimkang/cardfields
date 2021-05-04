import { Thing, Card, StoreType } from '../types';
import { CollectionStore, Store } from '../wily.js/stores/stores';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnCardChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { RenderCard, RenderCardCollection } from '../renderers/card-renderers';
import curry from 'lodash.curry';

const cardIdsKey = 'ids__cards';
var cardIdsPersister = IdsPersister(cardIdsKey);

export function assembleCardsMachine() {
  // CollectionStore.
  var collectionStore = registry.makeCollectionStoreHappen('card', null, () =>
    CollectionStore({
      idsPersister: cardIdsPersister,
      thingPersister,
      kind: 'card',
      parentThingId: null,
      vals: loadThings(cardIdsKey),
      alreadyPersisted: true,
      initValIsAlreadyDehydrated: false,
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
    parentSelector: '#cards-root .card-collection-container',
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
  onItemChangeFns.forEach((responder, i) => responder(itemStores[i]));

  return { renderCollection, collectionStore, itemStores, onItemChangeFns };

  function onItemChangeMapper(store: StoreType<Thing>) {
    return OnCardChange({
      render: RenderCard(),
      collectionStore,
      cardStore: store,
    });
  }
}

function createStoreForCard(isNew: boolean, card: Card) {
  return registry.makeStoreHappen(card.id, () =>
    Store<Thing>(thingPersister, card, null, null, !isNew, false)
  );
}

function createNewCard(): Card {
  return { id: `card-${uuid()}`, title: 'New card', text: '' };
}
