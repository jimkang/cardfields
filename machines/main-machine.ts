import type { Deck, CollectionStoreType, Thing, StoreType } from '../types';
import { OnEstablishContainerForChildren } from '../responders/render-responders';
import { CollectionStore, Store } from '../wily.js/stores/stores';
import { v4 as uuid } from 'uuid';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnDeckChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { RenderDeck, RenderDeckCollection } from '../renderers/deck-renderers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { DehydrateDeck, RehydrateDeck } from '../things/deck';
import { assemblePilesMachine } from './piles-machine';
import { pilesContainerClass } from '../consts';

const deckIdsKey = 'ids__decks';
var deckIdsPersister = IdsPersister(deckIdsKey);

export function assembleMainMachine(switchToNewDecks) {
  // Stores.
  var deckCollectionStore = registry.makeCollectionStoreHappen(
    'deck',
    null,
    () =>
      CollectionStore({
        idsPersister: deckIdsPersister,
        thingPersister,
        kind: 'deck',
        parentThingId: null,
        vals: loadThings(deckIdsKey),
        itemRehydrate: RehydrateDeck(thingPersister),
        alreadyPersisted: true,
        initValIsAlreadyDehydrated: false,
      })
  );

  var deckStores = deckCollectionStore
    .get()
    .map(curry(createStoreForDeck)(false));

  var activeDeckVal = thingPersister.get('active-deck');
  var activeDeckIdentifier = registry.makeStoreHappen('active-deck', () =>
    Store<Thing>(
      thingPersister,
      activeDeckVal || { id: 'active-deck', deckId: '' },
      null,
      null,
      !!activeDeckVal,
      true
    )
  );

  // Updaters.
  var addDeck = AddThing({
    collectionStore: deckCollectionStore,
    createNewThingInStore: () => createStoreForDeck(true, createNewDeck()),
    thingPersister,
    createItemResponder: curry(setUpDeckStoreDependents)(
      deckCollectionStore,
      activeDeckIdentifier
    ),
    storeRegistry: registry,
  });

  // Renderers.
  var renderDeckCollection = RenderDeckCollection({
    parentSelector: '.root',
    addThing: addDeck,
  });

  // Responders.
  var onCollectionChange = OnCollectionChange(
    renderDeckCollection,
    deckCollectionStore
  );
  onCollectionChange(deckCollectionStore);

  var onDeckChangeFns = deckStores.map(
    curry(setUpDeckStoreDependents)(deckCollectionStore, activeDeckIdentifier)
  );
  onDeckChangeFns.forEach((update, i) => update(deckStores[i]));

  if (switchToNewDecks) {
    activeDeckIdentifier.subscribe(switchToNewDecks);
  }
}

function createStoreForDeck(isNew: boolean, deck: Deck) {
  return registry.makeStoreHappen(deck.id, () =>
    Store<Thing>(
      thingPersister,
      deck,
      DehydrateDeck(),
      RehydrateDeck(thingPersister),
      !isNew,
      false
    )
  );
}

function setUpDeckStoreDependents(
  deckCollectionStore: CollectionStoreType,
  activeDeckIdentifier: StoreType<Thing>,
  deckStore: StoreType<Thing>
) {
  var {
    renderCollection,
    collectionStore,
    itemStores,
    onItemChangeFns,
  } = assemblePilesMachine({
    parentStore: deckStore,
  });

  // Deck item renderer.
  var render = RenderDeck({
    parentSelector: `#${deckStore.get().id}`,
    renderPileCollection: renderCollection,
    pileCollectionStore: collectionStore,
    onEstablishChildContainer: OnEstablishContainerForChildren(
      itemStores,
      onItemChangeFns,
      pilesContainerClass
    ),
  });
  return OnDeckChange({
    render,
    renderCollection,
    collectionStore: deckCollectionStore,
    activeDeckStore: activeDeckIdentifier,
    store: deckStore,
  });
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, title: 'New deck', piles: [] };
}
