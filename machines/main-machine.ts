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
import { OnDeckChange, OnPileChange } from '../responders/store-responders';
import { OnEstablishPilesContainer } from '../responders/render-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { RenderDeck, RenderDeckCollection } from '../renderers/deck-renderers';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { DehydrateDeck, RehydrateDeck } from '../things/deck';
import { rehydratePile } from '../things/pile';

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
        {
          idsPersister: deckIdsPersister, thingPersister, kind: 'deck', parentThingId: null,
          vals: loadThings(deckIdsKey),
          itemRehydrate: RehydrateDeck(thingPersister)
        }      
      )
  );

  var deckStores = deckCollectionStore
    .get()
    .map((thing) =>
      registry.makeStoreHappen(thing.id, () =>
        ThingStore(thingPersister, thing, DehydrateDeck(thingPersister), RehydrateDeck(thingPersister))
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
        {
          idsPersister: pilesPersister,
          thingPersister,
          kind: 'pile',
          parentThingId: deckStore.get().id,
          vals: deckStore.get().piles
        }      
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
    curry(OnPileChange)(RenderPile(), pileCollectionStore, deckStore),
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

  return OnDeckChange(
    RenderDeck({
      parentSelector: `#${deckStore.get().id}`,
      renderPileCollection,
      pileCollectionStore,
      onEstablishElement: OnEstablishPilesContainer(
        pileStores,
        onPileChangeFns
      ),
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
    RenderPile(),
    pileCollectionStore,
    containingDeckStore,
    store
  );
}
