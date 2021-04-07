import type { Deck, ThingStoreType, CollectionStoreType } from '../types';
import { OnEstablishPilesContainer } from '../responders/render-responders';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
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
      })
  );

  var deckStores = deckCollectionStore
    .get()
    .map((thing) =>
      registry.makeStoreHappen(thing.id, () =>
        ThingStore(
          thingPersister,
          thing,
          DehydrateDeck(thingPersister),
          RehydrateDeck(thingPersister)
        )
      )
    );

  var activeDeckIdentifier = registry.makeStoreHappen('active-deck', () =>
    ThingStore(
      thingPersister,
      thingPersister.get('active-deck') || { id: 'active-deck', deckId: '' }
    )
  );

  // Updaters.
  var addDeck = AddThing(
    deckCollectionStore,
    createNewDeck,
    thingPersister,
    curry(setUpDeckStoreDependents)(deckCollectionStore, activeDeckIdentifier),
    registry
  );

  // Renderers.
  var renderDeckCollection = RenderDeckCollection({
    parentSelector: '.root',
    addThing: addDeck,
  });

  // Responders.
  var updateDeckCollection = OnCollectionChange(
    renderDeckCollection,
    deckCollectionStore
  );
  updateDeckCollection(deckCollectionStore);

  var updateDeckFns = deckStores.map(
    curry(setUpDeckStoreDependents)(deckCollectionStore, activeDeckIdentifier)
  );
  updateDeckFns.forEach((update, i) => update(deckStores[i]));

  if (switchToNewDecks) {
    activeDeckIdentifier.subscribe(switchToNewDecks);
  }
}


function setUpDeckStoreDependents(
  deckCollectionStore: CollectionStoreType,
  activeDeckIdentifier: ThingStoreType,
  deckStore: ThingStoreType
) {
  var {
    renderCollection,
    collectionStore,
    itemStores,
    onItemChangeMapper,
  } = assemblePilesMachine({
    parentStore: deckStore,
  });

  var onPileChangeFns = itemStores.map(
    curry(onItemChangeMapper)(collectionStore, deckStore)
  );
  // Deck item renderer.
  var render = RenderDeck({
    parentSelector: `#${deckStore.get().id}`,
    renderPileCollection: renderCollection,
    pileCollectionStore: collectionStore,
    onEstablishElement: OnEstablishPilesContainer(itemStores, onPileChangeFns),
  });
  return OnDeckChange({
    render,
    collectionStore: deckCollectionStore,
    activeDeckStore: activeDeckIdentifier,
    store: deckStore,
  });
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, title: 'New deck', piles: [] };
}
