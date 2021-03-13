import type { Deck, ThingStoreType, CollectionStoreType } from '../types';

import { ThingStore, CollectionStore } from '../wily.js/stores';
import { v4 as uuid } from 'uuid';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { UpdateCollection } from '../wily.js/updaters/basic-updaters';
import { UpdateDeck } from '../updaters/updaters';
import { AddThing } from '../wily.js/downdaters/collection-modifiers';
import { RenderDeck, RenderDeckCollection } from '../renderers/deck-renderers';
import curry from 'lodash.curry';

const idsKey = 'ids__decks';
var idsPersister = IdsPersister(idsKey);

export function assembleDecksMachine(switchToNewDecks) {
  // Stores.
  var deckCollectionStore = CollectionStore(
    idsPersister,
    thingPersister,
    loadThings(idsKey)
  );
  var deckStores = deckCollectionStore
    .get()
    .map((thing) => ThingStore(thingPersister, thing));

  var activeDeckIdentifier = ThingStore(
    thingPersister,
    thingPersister.get('active-deck') || { id: 'active-deck', deckId: '' }
  );

  // Downdaters.
  var addDeck = AddThing(
    deckCollectionStore,
    createNewDeck,
    thingPersister,
    curry(updateDeckMapper)(deckCollectionStore, activeDeckIdentifier)
  );

  // Renderers.
  var renderDeckCollection = RenderDeckCollection({
    parentSelector: '.root',
    addThing: addDeck,
  });

  // Updaters.
  var updateDeckCollection = UpdateCollection(
    renderDeckCollection,
    deckCollectionStore
  );

  updateDeckCollection(deckCollectionStore);
  var updateDeckFns = deckStores.map(
    curry(updateDeckMapper)(deckCollectionStore, activeDeckIdentifier)
  );
  updateDeckFns.forEach((update, i) => update(deckStores[i]));

  if (switchToNewDecks) {
    activeDeckIdentifier.subscribe(switchToNewDecks);
  }
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, title: 'Shabadoo', piles: [] };
}

function updateDeckMapper(
  deckCollectionStore: CollectionStoreType,
  activeDeckIdentifier: ThingStoreType,
  store: ThingStoreType
) {
  return UpdateDeck(
    RenderDeck({ parentSelector: `#${store.get().id}` }),
    deckCollectionStore,
    activeDeckIdentifier,
    store
  );
}
