//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { Deck, ThingStoreType, Persister, Pile } from '../../types';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { UpdateDeck, UpdatePile } from '../../updaters/updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';
import {
  RenderDeck,
  RenderDeckCollection,
} from '../../renderers/deck-renderers';
import {
  RenderPile,
  //RenderPileCollection,
} from '../../renderers/pile-renderers';

var container = {};
const idsKey = 'ids__decks';
var idsPersister = IdsPersister(idsKey);

function PilesPersister(deckColStore): Persister {
  return {
    write(piles: Pile[]) {
      deckColStore.setPart({ piles });
    },
    delete() {
      deckColStore.setPart({ piles: [] });
    },
    get() {
      return deckColStore.get().piles;
    },
  };
}

var deckCollectionStore = CollectionStore(
  idsPersister,
  thingPersister,
  loadThings(idsKey)
);
var deckStores = deckCollectionStore
  .get()
  .map((thing) => ThingStore(thingPersister, thing));

var activeDeckStore = ThingStore(
  thingPersister,
  thingPersister.get('active-deck') || { id: 'active-deck', piles: [] }
);

var addDeck = AddThing(
  deckCollectionStore,
  createNewDeck,
  thingPersister,
  DeckUpdater
);

var pilesPersister: Persister = PilesPersister(deckCollectionStore);

var pileCollectionStore = CollectionStore(
  pilesPersister,
  thingPersister,
  activeDeckStore.get().piles // TODO: Make sure this is valid at this time.
);

var renderDeckCollection = RenderDeckCollection({
  parentSelector: '.root',
  addThing: addDeck,
});

var updateDeckCollection = UpdateCollection(
  renderDeckCollection,
  deckCollectionStore
);

updateDeckCollection(deckCollectionStore);
var updateItems = deckStores.map(DeckUpdater);
updateItems.forEach((update, i) => update(deckStores[i]));

function DeckUpdater(store: ThingStoreType) {
  return UpdateDeck(
    RenderDeck({ parentSelector: `#${store.get().id}` }),
    deckCollectionStore,
    activeDeckStore,
    store
  );
}

function PileUpdater(store: ThingStoreType) {
  return UpdatePile(
    RenderPile({ parentSelector: `#${store.get().id}` }),
    pileCollectionStore,
    activeDeckStore,
    store
  );
}

function createNewDeck(): Deck {
  return { id: `deck-${uuid()}`, title: 'Shabadoo', piles: [] };
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}

export default container;
