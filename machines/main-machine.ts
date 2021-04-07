import type { Deck, Pile, ThingStoreType, CollectionStoreType } from '../types';
import { OnEstablishPilesContainer } from '../responders/render-responders';
import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import { v4 as uuid } from 'uuid';
import {
  thingPersister,
  IdsPersister,
  loadThings,
} from '../wily.js/persistence/local';
import { OnCollectionChange } from '../wily.js/responders/basic-responders';
import { OnDeckChange, OnPileChange } from '../responders/store-responders';
import { AddThing } from '../wily.js/updaters/collection-modifiers';
import { RenderDeck, RenderDeckCollection } from '../renderers/deck-renderers';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import curry from 'lodash.curry';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { DehydrateDeck, RehydrateDeck } from '../things/deck';
import { assembleSubMachine } from './sub-machine';
import { PilesPersister } from '../persisters/piles-persister';
const deckIdsKey = 'ids__decks';

export function assembleMainMachine(switchToNewDecks) {
  var activeDeckIdentifier = registry.makeStoreHappen('active-deck', () =>
    ThingStore(
      thingPersister,
      thingPersister.get('active-deck') || { id: 'active-deck', deckId: '' }
    )
  );

  var {
    collectionStore,
    itemStores,
  } = assembleSubMachine({
    parentStore: activeDeckIdentifier,
    CollectionPersister: () => IdsPersister(deckIdsKey),
    kind: 'deck',
    createNewThing: createNewDeck,
    RenderCollection: RenderDeckCollection,
    RenderItem: RenderDeck,
    ItemChangeResponder: OnDeckChange,
    itemRehydrate: RehydrateDeck(thingPersister),
  });

  var onDeckChangeFns = itemStores.map(
    curry(setUpDeckStoreDependents)(collectionStore, activeDeckIdentifier)
  );
  onDeckChangeFns.forEach((update, i) => update(itemStores[i]));

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
  } = assembleSubMachine({
    parentStore: deckStore,
    CollectionPersister: PilesPersister,
    kind: 'pile',
    createNewThing: createNewPile,
    RenderCollection: RenderPileCollection,
    RenderItem: RenderPile,
    ItemChangeResponder: OnPileChange,
    parentThingId: deckStore.get().id
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

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}
