import type { ThingStoreType } from '../../types';
import { assembleMainMachine } from '../../machines/main-machine';
//import { thingPersister } from '../../wily.js/persistence/local';
import { storeRegistry as registry } from '../../wily.js/stores/store-registry';

var container = {};
assembleMainMachine(changePiles);

function changePiles(activeDeckIdentifier: ThingStoreType) {
  // TODO: Tear down previous machine.
  //var deckStore: ThingStoreType = registry.getStore(
  //activeDeckIdentifier.get().deck
  //);
}

export default container;
