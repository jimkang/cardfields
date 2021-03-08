//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { Deck, ThingStoreType } from '../../types';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { UpdateDeck } from '../../updaters/updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';
import {
  RenderDeck,
  RenderDeckCollection,
} from '../../renderers/deck-renderers';

var container = {};
const idsKey = 'ids__decks';
var idsPersister = IdsPersister(idsKey);

var collectionStore = CollectionStore(
  idsPersister,
  thingPersister,
  loadThings(idsKey)
);

var deckStores = collectionStore
  .get()
  .map((thing) => ThingStore(thingPersister, thing));

var activeDeckStore = ThingStore(
  thingPersister,
  thingPersister.get('active-deck') || { id: 'active-deck', piles: [] }
);

var addThing = AddThing(
  collectionStore,
  createNewDeck,
  thingPersister,
  createItemUpdater
);

var renderCollection = RenderDeckCollection({
  parentSelector: '.root',
  addThing,
});

var updateCollection = UpdateCollection(renderCollection, collectionStore);

updateCollection(collectionStore);
var updateItems = deckStores.map(createItemUpdater);
updateItems.forEach((update, i) => update(deckStores[i]));

function createItemUpdater(store: ThingStoreType) {
  return UpdateDeck(
    RenderDeck({ parentSelector: `#${store.get().id}` }),
    collectionStore,
    activeDeckStore,
    store
  );
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, name: 'Shabadoo', piles: [] };
}

export default container;
