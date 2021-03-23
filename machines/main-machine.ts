import type {
  Deck,
  Pile,
  ThingStoreType,
  CollectionStoreType,
  Persister,
} from '../types';

import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { v4 as uuid } from 'uuid';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { PilesPersister } from '../persisters/piles-persister';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnDeckChange, OnPileChange } from '../responders/responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { RenderDeck, RenderDeckCollection } from '../renderers/deck-renderers';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';

const deckIdsKey = 'ids__decks';
const pileIdsKey = 'ids__piles';
var deckIdsPersister = IdsPersister(deckIdsKey);

export function assembleMainMachine(switchToNewDecks) {
  // Stores.
  var deckCollectionStore = registry.makeCollectionStoreHappen(
    'deck',
    null,
    () =>
      CollectionStore(
        deckIdsPersister,
        thingPersister,
        'deck',
        null,
        loadThings(deckIdsKey)
      )
  );

  var deckStores = deckCollectionStore
    .get()
    .map((thing) =>
      registry.makeStoreHappen(thing.id, () =>
        ThingStore(thingPersister, thing)
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
    curry(deckResponderMapper)(deckCollectionStore, activeDeckIdentifier),
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
    curry(deckResponderMapper)(deckCollectionStore, activeDeckIdentifier)
  );
  updateDeckFns.forEach((update, i) => update(deckStores[i]));

  if (switchToNewDecks) {
    activeDeckIdentifier.subscribe(switchToNewDecks);
  }
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, title: 'Shabadoo', piles: [] };
}

// Kind of setting up a sub-machine here.
function deckResponderMapper(
  deckCollectionStore: CollectionStoreType,
  activeDeckIdentifier: ThingStoreType,
  deckStore: ThingStoreType
) {
  var pilesPersister: Persister = PilesPersister(deckStore);

  var pileCollectionStore = registry.makeCollectionStoreHappen(
    'pile',
    null,
    () =>
      CollectionStore(
        pilesPersister,
        thingPersister,
        'pile',
        null,
        loadThings(pileIdsKey)
      )
  );

  var pileStores = pileCollectionStore
    .get()
    .map((thing) =>
      registry.makeStoreHappen(thing.id, () =>
        ThingStore(thingPersister, thing)
      )
    );

  var addPile = AddThing(
    pileCollectionStore,
    createNewPile,
    thingPersister,
    curry(OnPileChange)(pileCollectionStore, deckStore),
    registry
  );

  var renderPileCollection = RenderPileCollection({
    parentSelector: `#${deckStore.get().id} .pile-collection-container`,
    addThing: addPile,
    renderPileCollection,
    pileCollectionStore,
  });

  var onPileCollectionChange = OnCollectionChange(
    renderPileCollection,
    pileCollectionStore
  );
  onPileCollectionChange(pileCollectionStore);
  var onPileChangeFns = pileStores.map(
    curry(onPileChangeMapper)(pileCollectionStore, deckStore)
  );
  onPileChangeFns.forEach((update, i) => update(pileStores[i]));

  return OnDeckChange(
    RenderDeck({
      parentSelector: `#${deckStore.get().id}`,
      renderPileCollection,
      pileCollectionStore,
    }),
    deckCollectionStore,
    activeDeckIdentifier,
    deckStore
  );
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}

function onPileChangeMapper(
  pileCollectionStore: CollectionStoreType,
  containingDeckStore: ThingStoreType,
  store: ThingStoreType
) {
  return OnPileChange(
    RenderPile({ parentSelector: `#${store.get().id}` }),
    pileCollectionStore,
    containingDeckStore,
    store
  );
}