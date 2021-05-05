import { Thing, Plane, StoreType } from '../types';
import { CollectionStore, Store } from '../wily.js/stores/stores';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnThingChange } from '../responders/store-responders';
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

const planeIdsKey = 'ids__planes';
var planeIdsPersister = IdsPersister(planeIdsKey);

export function assemblePlanesMachine() {
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
    return OnThingChange({
      render: RenderPlane(storeRegistry),
      collectionStore,
      thingStore: store,
    });
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
  return plane;
}
