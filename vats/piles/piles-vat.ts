import { assembleMainMachine } from '../../machines/main-machine';
import { StoreType, Thing } from '../../types';
//import { thingPersister } from '../../wily.js/persistence/local';
import { storeRegistry as registry } from '../../wily.js/stores/store-registry';

var container = {};
assembleMainMachine(changePiles);

function changePiles(activeDeckIdentifier: StoreType<Thing>) {
  // TODO: Tear down previous machine.
  //var deckStore: ThingStoreType = registry.getStore(
  //activeDeckIdentifier.get().deck
  //);
}

export default container;
