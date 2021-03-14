import type {
  Deck,
  ThingStoreType,
  CollectionStoreType,
  Pile,
} from '../../types';
import { assembleDecksMachine } from '../../machines/assemble-decks-machine';
import { assemblePilesMachine } from '../../machines/assemble-piles-machine';
//import { thingPersister } from '../../wily.js/persistence/local';
import { clearinghouse as ch } from '../../wily.js/stores/clearinghouse';

var container = {};
assembleDecksMachine(changePiles);

function changePiles(activeDeckIdentifier: ThingStoreType) {
  // TODO: Tear down previous machine.
  var deckStore: ThingStoreType = ch.getStore(activeDeckIdentifier.get().deck);

  assemblePilesMachine(deckStore);
}

export default container;
