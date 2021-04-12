import {
  ThingStoreType,
  Persister,
  Thing,
  CollectionStoreType,
  Pile,
} from '../types';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnPileChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { PiggybackPersister } from '../persisters/piggyback-persister';
import { v4 as uuid } from 'uuid';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import { pilesContainerClass } from '../consts';
import { OnEstablishPilesContainer } from '../responders/render-responders';
import { assembleCardsMachine } from './cards-machine';
import { DehydratePile, RehydratePile } from '../things/pile';

export function assemblePilesMachine({
  parentStore,
}: {
  parentStore: ThingStoreType;
  }) {
  // Persister
  var idsPersister: Persister = PiggybackPersister(parentStore, 'piles');

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
    .map(createPileStore)

  // Updater.
  var addThing = AddThing({
    collectionStore,
    createNewThingInStore: () => createPileStore(createNewPile()),
    thingPersister,
    createItemResponder: setUpPileStoreDependents,
    storeRegistry: registry,
  });

  // Renderer.
  var renderCollection = RenderPileCollection({
    parentSelector: `#${parentStore.get().id} .${pilesContainerClass}`,
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
  var onItemChangeFns = itemStores.map(
    setUpPileStoreDependents
  );

  return { renderCollection, collectionStore, itemStores, onItemChangeFns };

  function setUpPileStoreDependents(
    pileStore: ThingStoreType
  ) {
    // Cards machine.
    var {
      collectionStore,
      itemStores,
      onItemChangeFns,
    } = assembleCardsMachine({
      parentStore: pileStore,
    });
    // Pile item renderer.
    var render = RenderPile({
      renderCardCollection: () => { },
      cardCollectionStore: collectionStore,
      onEstablishChildContainer: OnEstablishPilesContainer(
        itemStores,
        onItemChangeFns
      ),
    });
    return OnPileChange({
      render,
      collectionStore,
      deckStore: parentStore,
      pileStore,
    });
  }
}

function createPileStore(pile: Pile) {
  return registry.makeStoreHappen(pile.id, () => ThingStore(thingPersister, pile, DehydratePile(thingPersister), RehydratePile(thingPersister))
  );
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}
