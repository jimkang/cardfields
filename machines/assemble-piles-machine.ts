import { ThingStore, CollectionStore } from '../wily.js/stores/stores';
import type {
  ThingStoreType,
  CollectionStoreType,
  Persister,
  Pile,
} from '../types';
import { thingPersister } from '../wily.js/persistence/local';
import { PilesPersister } from '../persisters/piles-persister';
import { AddThing } from '../wily.js/downdaters/collection-modifiers';
import { RenderPile, RenderPileCollection } from '../renderers/pile-renderers';
import { UpdateCollection } from '../wily.js/updaters/basic-updaters';
import { UpdatePile } from '../updaters/updaters';
import curry from 'lodash.curry';
import { v4 as uuid } from 'uuid';
import { clearinghouse as ch } from '../wily.js/stores/clearinghouse';

// TODO: Consider refactoring when you make a third machine.
export function assemblePilesMachine(containingDeckStore: ThingStoreType) {
  // Stores.
  var pilesPersister: Persister = PilesPersister(containingDeckStore);
  var pileCollectionStore = CollectionStore(
    pilesPersister,
    thingPersister,
    containingDeckStore.get().piles
  );
  var pileStores = pileCollectionStore
    .get()
    .map((thing) => ch.putStore(ThingStore(thingPersister, thing)));

  // Downdaters.
  var addPile = AddThing(
    pileCollectionStore,
    createNewPile,
    thingPersister,
    curry(PileUpdater)(pileCollectionStore, containingDeckStore),
    ch
  );

  // Renderers.
  var renderPileCollection = RenderPileCollection({
    parentSelector: '.pile-section',
    addThing: addPile,
  });

  // Updaters.
  var updatePileCollection = UpdateCollection(
    renderPileCollection,
    pileCollectionStore
  );
  updatePileCollection(pileCollectionStore);

  var updatePileFns = pileStores.map(
    curry(updatePileMapper)(pileCollectionStore, containingDeckStore)
  );
  updatePileFns.forEach((update, i) => update(pileStores[i]));
}

function PileUpdater(
  pileCollectionStore: CollectionStoreType,
  deckStore: ThingStoreType,
  store: ThingStoreType
) {
  return UpdatePile(
    RenderPile({ parentSelector: `#${store.get().id}` }),
    pileCollectionStore,
    deckStore,
    store
  );
}

function createNewPile(): Pile {
  return { id: `pile-${uuid()}`, title: 'New pile', cards: [] };
}

function updatePileMapper(
  pileCollectionStore: CollectionStoreType,
  containingDeckStore: ThingStoreType,
  store: ThingStoreType
) {
  return UpdatePile(
    RenderPile({ parentSelector: `#${store.get().id}` }),
    pileCollectionStore,
    containingDeckStore,
    store
  );
}
