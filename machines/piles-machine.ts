import { Persister, Pile, Deck, StoreType, Thing } from '../types';
import { CollectionStore, Store } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnPileChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { PiggybackPersister } from '../persisters/piggyback-persister';
import { v4 as uuid } from 'uuid';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import { cardsContainerClass, pilesContainerClass } from '../consts';
import { OnEstablishContainerForChildren } from '../responders/render-responders';
import { assembleCardsMachine } from './cards-machine';
import { DehydratePile, RehydratePile } from '../things/pile';
import curry from 'lodash.curry';

export function assemblePilesMachine({
  parentStore,
}: {
  parentStore: StoreType<Deck>;
}) {
  // Persister
  var idsPersister: Persister = PiggybackPersister(parentStore, 'piles');

  // CollectionStore.
  const parentThingId = parentStore.get().id;
  var collectionStore = registry.makeCollectionStoreHappen(
    'pile',
    parentThingId,
    () =>
      CollectionStore({
        idsPersister,
        thingPersister,
        kind: 'pile',
        parentThingId,
        vals: (parentStore.getRaw() as Deck).piles,
        itemRehydrate: RehydratePile(thingPersister),
        alreadyPersisted: true,
        initValIsAlreadyDehydrated: true,
      })
  );

  // Item stores.
  var itemStores = collectionStore.get().map(curry(createStoreForPile)(false));

  // Updater.
  var addThing = AddThing({
    collectionStore,
    createNewThingInStore: () => createStoreForPile(true, createNewPile()),
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
  var onItemChangeFns = itemStores.map(setUpPileStoreDependents);

  return { renderCollection, collectionStore, itemStores, onItemChangeFns };

  function setUpPileStoreDependents(pileStore: StoreType<Thing>) {
    // Cards machine.
    var cardsMachine = assembleCardsMachine({
      parentStore: pileStore,
      pilesStore: collectionStore,
    });
    // Pile item renderer.
    var render = RenderPile({
      renderCardCollection: cardsMachine.renderCollection,
      cardCollectionStore: cardsMachine.collectionStore,
      onEstablishChildContainer: OnEstablishContainerForChildren(
        cardsMachine.itemStores,
        cardsMachine.onItemChangeFns,
        cardsContainerClass
      ),
    });
    return OnPileChange({
      render,
      renderCollection,
      collectionStore,
      deckStore: parentStore,
      pileStore,
    });
  }
}

function createStoreForPile(isNew: boolean, pile: Pile) {
  return registry.makeStoreHappen(pile.id, () =>
    Store<Thing>(
      thingPersister,
      pile,
      DehydratePile(),
      RehydratePile(thingPersister),
      !isNew,
      false
    )
  );
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}
