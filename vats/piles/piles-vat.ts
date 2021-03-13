import type {
  Deck,
  ThingStoreType,
  CollectionStoreType,
  Pile,
} from '../../types';
import { assembleDecksMachine } from '../../machines/assemble-decks-machine';
import { assemblePilesMachine } from '../../machines/assemble-piles-machine';
import { thingPersister } from '../../wily.js/persistence/local';

var container = {};
assembleDecksMachine(changePiles);

function changePiles(activeDeckIdentifier: ThingStoreType) {
  // TODO: Tear down previous machine.
  // TODO: Get deck store, not deck.
  var deckStore = thingPersister.get(activeDeckIdentifier.get().deck);

  assemblePilesMachine(deckStore);
}

export default container;
