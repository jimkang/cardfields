import { CollectionStore, Store } from '../wily.js/stores/stores';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnThingChange } from '../responders/store-responders';
import {
  OnEstablishCardContainer,
  OnEstablishZoneContainer,
} from '../responders/render-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { storeRegistry } from '../wily.js/stores/store-registry';
import {
  thingPersister,
  IdsPersister,
  loadThings,
  writeThing,
} from '../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import {
  RenderPlane,
  RenderPlaneCollection,
} from '../renderers/plane-renderers';
import curry from 'lodash.curry';
import { RenderCard } from '../renderers/card-renderers';
import { RenderZone } from '../renderers/zone-renderers';
import {
  Zone,
  Card,
  CollectionStoreType,
  Plane,
  StoreType,
  Thing,
} from '../types';
import { DeletePlaneChild } from '../updaters/updaters';

const cardIdsKey = 'ids__cards';
const zoneIdsKey = 'ids__zones';
const planeIdsKey = 'ids__planes';

var cardIdsPersister = IdsPersister(cardIdsKey);
var zoneIdsPersister = IdsPersister(zoneIdsKey);
var planeIdsPersister = IdsPersister(planeIdsKey);

var renderCard = RenderCard({
  deleteCard: DeletePlaneChild({
    storeRegistry,
    typeName: 'card',
    collectionMemberName: 'cardPts',
  }),
});
var renderZone = RenderZone({
  deleteZone: DeletePlaneChild({
    storeRegistry,
    typeName: 'zone',
    collectionMemberName: 'zonePts',
  }),
});

var onEstablishCardContainer = OnEstablishCardContainer(
  storeRegistry,
  renderCard
);

var onEstablishZoneContainer = OnEstablishZoneContainer(
  storeRegistry,
  renderZone
);

export function assemblePlanesMachine() {
  var cardCollectionStore: CollectionStoreType = setUpCardStores();
  var zoneCollectionStore: CollectionStoreType = setUpZoneStores();

  var planes: Plane[] = loadThings(planeIdsKey).map(tuneUpPlanes) as Plane[];
  var alreadyPersisted = true;
  // If no planes, create the default plane.
  if (planes.length < 1) {
    let plane = createNewPlane('Default plane');
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

  function onItemChangeMapper(planeStore: StoreType<Thing>) {
    // Card updaters.
    var addCard = AddThing({
      collectionStore: cardCollectionStore,
      createNewThingInStore: createNewCardInStore,
      thingPersister,
      createItemResponder: createCardResponder,
      storeRegistry,
    });

    function createNewCardInStore() {
      var newCard = createNewCard();
      var planes: Plane[] = storeRegistry
        .getCollectionStore('plane', null)
        .get();
      planes.forEach(addCardToPlane);
      return createStoreForCard(true, newCard);

      // TODO: Move to updaters?
      function addCardToPlane(plane: Plane) {
        planeStore.setPart({
          cardPts: plane.cardPts.concat([
            { cardId: newCard.id, pt: [0, 0, 0] },
          ]),
        });
      }
    }

    // Zone updaters.
    var addZone = AddThing({
      collectionStore: zoneCollectionStore,
      createNewThingInStore: createNewZoneInStore,
      thingPersister,
      createItemResponder: createZoneResponder,
      storeRegistry,
      associatedStore: planeStore,
    });

    return OnThingChange({
      render: RenderPlane({
        onEstablishCardContainer,
        addCard,
        onEstablishZoneContainer,
        addZone,
      }),
      collectionStore,
      thingStore: planeStore,
    });

    function createNewZoneInStore(planeStore) {
      var newZone = createNewZone();
      var plane = planeStore.get();
      planeStore.setPart({
        zonePts: plane.zonePts.concat([{ zoneId: newZone.id, center: [0, 0] }]),
      });

      return createStoreForZone(true, newZone);
    }
  }

  function createCardResponder() {
    return function respondToCardCreation(store: StoreType<Card>) {
      renderCard(cardCollectionStore, store);
    };
  }

  function createZoneResponder() {
    return function respondToZoneCreation(store: StoreType<Card>) {
      renderZone(zoneCollectionStore, store);
    };
  }
}

function createStoreForPlane(isNew: boolean, plane: Plane) {
  return storeRegistry.makeStoreHappen(plane.id, () =>
    Store<Thing>(thingPersister, plane, null, null, !isNew, false)
  );
}

function createNewPlane(title = 'New plane'): Plane {
  var plane = {
    id: `plane-${uuid()}`,
    title,
    text: '',
    cardPts: [],
    zonePts: [],
    visible: true,
  };

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

// Consider refactoring the setUp functions.
function setUpZoneStores() {
  var collectionStore = storeRegistry.makeCollectionStoreHappen(
    'zone',
    null,
    () =>
      CollectionStore({
        idsPersister: zoneIdsPersister,
        thingPersister,
        kind: 'zone',
        parentThingId: null,
        vals: loadThings(zoneIdsKey),
        alreadyPersisted: true,
        initValIsAlreadyDehydrated: false,
      })
  );

  // Item stores.
  collectionStore.get().map(curry(createStoreForZone)(false));
  return collectionStore;
}

export function createStoreForCard(isNew: boolean, card: Card) {
  return storeRegistry.makeStoreHappen(card.id, () =>
    Store<Thing>(thingPersister, card, null, null, !isNew, false)
  );
}

export function createStoreForZone(isNew: boolean, zone: Zone) {
  return storeRegistry.makeStoreHappen(zone.id, () =>
    Store<Thing>(thingPersister, zone, null, null, !isNew, false)
  );
}

function createNewCard(): Card {
  return { id: `card-${uuid()}`, title: 'New card', text: '', visible: true };
}

function createNewZone(): Zone {
  return {
    id: `zone-${uuid()}`,
    title: 'New zone',
    width: 300,
    height: 300,
    visible: true,
    color: 'hsla(0, 0%, 50%, 0.5)',
  };
}

// Assumes storeRegistry is populated.
function tuneUpPlanes(obj) {
  if (!obj.zonePts) {
    obj.zonePts = [];
  }
  for (let i = obj.zonePts.length - 1; i > -1; --i) {
    if (!storeRegistry.getStore(obj.zonePts[i].zoneId)) {
      console.error(
        obj.zonePts[i].zoneId,
        'listed in',
        obj.id,
        'zonePts is not in storage.'
      );
      obj.zonePts.splice(i, 1);
    }
  }

  if (!obj.cardPts) {
    obj.cardPts = [];
  }
  for (let i = obj.cardPts.length - 1; i > -1; --i) {
    if (!storeRegistry.getStore(obj.cardPts[i].cardId)) {
      console.error(
        obj.cardPts[i].cardId,
        'listed in',
        obj.id,
        'cardPts is not in storage.'
      );
      obj.cardPts.splice(i, 1);
    }
  }
  writeThing(obj);
  return obj;
}
