import { assembleMainMachine } from '../../machines/main-machine';
import { StoreType, Thing } from '../../types';
//import { thingPersister } from '../../wily.js/persistence/local';
import { RenderPortControls } from '../../renderers/import-export-renderers';
import {
  exportFromLocalStorage,
  importToLocalStorage,
} from '../../persisters/import-export';

var container = {};
assembleMainMachine(changePiles);

var renderPortControls = RenderPortControls(
  '.port-controls',
  exportFromLocalStorage,
  importToLocalStorage
);
renderPortControls();

renderExportZone();

function changePiles(activeDeckIdentifier: StoreType<Thing>) {
  // TODO: Tear down previous machine.
  //var deckStore: ThingStoreType = registry.getStore(
  //activeDeckIdentifier.get().deck
  //);
}

function renderExportZone() {
  document.querySelector('.export-zone-container').innerHTML =
    '<button>Export everything</button>';
}

export default container;
