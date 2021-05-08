import { CollectionStore, Store } from '../wily.js/stores/stores';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnThingChange } from '../responders/store-responders';
import { OnEstablishCardContainer } from '../responders/render-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { storeRegistry } from '../wily.js/stores/store-registry';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import {
  RenderPlane,
  RenderPlaneCollection,
} from '../renderers/plane-renderers';
import curry from 'lodash.curry';
import { renderCard } from '../renderers/card-renderers';
import { Card, CollectionStoreType, Plane, StoreType, Thing } from '../types';

const cardIdsKey = 'ids__cards';
var cardIdsPersister = IdsPersister(cardIdsKey);

const planeIdsKey = 'ids__planes';
var planeIdsPersister = IdsPersister(planeIdsKey);

var onEstablishCardContainer = OnEstablishCardContainer(
  storeRegistry,
  renderCard
);

export function assemblePlanesMachine() {
  var cardCollectionStore: CollectionStoreType = setUpCardStores();

  var planes: Plane[] = loadThings(planeIdsKey) as Plane[];
  var alreadyPersisted = true;
  // If no planes, create the default plane.
  if (planes.length < 1) {
    let plane = createDefaultPlane();
    // Creating the store also persists it.
    createStoreForPlane(true, plane);
    planes.push(plane);
    alreadyPersisted = false;
  }
  // CollectionStore.
  var collectionStore = storeRegistry.makeCollectionStoreHappen(
    'plane',
    null,
    () =>
      CollectionStore({
        idsPersister: planeIdsPersister,
        thingPersister,
        kind: 'plane',
        parentThingId: null,
        vals: planes,
        alreadyPersisted,
        initValIsAlreadyDehydrated: false,
      })
  );

  // Item stores.
  var itemStores = collectionStore.get().map(curry(createStoreForPlane)(false));

  // Updater.
  var addThing = AddThing({
    collectionStore,
    createNewThingInStore: () => createStoreForPlane(true, createNewPlane()),
    thingPersister,
    createItemResponder: onItemChangeMapper,
    storeRegistry,
  });

  // Renderer.
  var renderCollection = RenderPlaneCollection({
    parentSelector: '#planes-container',
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
    // Card updaters.
    var addCard = AddThing({
      collectionStore: cardCollectionStore,
      createNewThingInStore: createNewCardInStore,
      thingPersister,
      createItemResponder: createCardResponder,
      storeRegistry,
    });

    return OnThingChange({
      render: RenderPlane({ onEstablishCardContainer, addCard }),
      collectionStore,
      thingStore: store,
    });

    function createNewCardInStore() {
      var newCard = createNewCard();
      store.setPart({
        cardPts: store
          .get()
          .cardPts.concat([{ cardId: newCard.id, pt: [0, 0, 0] }]),
      });
      return createStoreForCard(true, newCard);
    }
  }

  function createCardResponder() {
    return function respondToCardCreation(store: StoreType<Card>) {
      renderCard(cardCollectionStore, store);
    };
  }
}

function createStoreForPlane(isNew: boolean, plane: Plane) {
  return storeRegistry.makeStoreHappen(plane.id, () =>
    Store<Thing>(thingPersister, plane, null, null, !isNew, false)
  );
}

function createNewPlane(): Plane {
  return {
    id: `plane-${uuid()}`,
    title: 'New plane',
    text: '',
    cardPts: [],
    visible: true,
  };
}

function createDefaultPlane(): Plane {
  var plane = createNewPlane();
  plane.title = 'Default plane';
  // TODO: Set up cardPts.
  var cards = storeRegistry.getCollectionStore('card', null).get();
  for (var i = 0; i < cards.length; ++i) {
    plane.cardPts.push({
      cardId: cards[i].id,
      pt: [(i % 8) * 200, ~~(i / 8) * 200, 0],
    });
  }
  return plane;
}

function setUpCardStores() {
  var collectionStore = storeRegistry.makeCollectionStoreHappen(
    'card',
    null,
    () =>
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
  collectionStore.get().map(curry(createStoreForCard)(false));
  return collectionStore;
}

export function createStoreForCard(isNew: boolean, card: Card) {
  return storeRegistry.makeStoreHappen(card.id, () =>
    Store<Thing>(thingPersister, card, null, null, !isNew, false)
  );
}

function createNewCard(): Card {
  return { id: `card-${uuid()}`, title: 'New card', text: '', visible: true };
}
