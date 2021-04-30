import { View, Thing } from '../types';
import { Store } from '../wily.js/stores/stores';
import { thingPersister } from '../wily.js/persistence/local';
import { storeRegistry as registry } from '../wily.js/stores/store-registry';
import { RenderHand } from '../renderers/hand-renderers';
import { DehydrateView, RehydrateView } from '../things/view';

//const viewIdsKey = 'ids__views';
//var viewIdsPersister = IdsPersister(viewIdsKey);

export function assembleViewMachine(view: View) {
  // Stores.
  var viewStore = registry.makeStoreHappen(view.id, () =>
    Store<Thing>(
      thingPersister,
      view,
      DehydrateView(),
      RehydrateView(thingPersister),
      false,
      false
    )
  );
  // TODO: We don't want to assemble a whole
  // cards machine. We just want to show the
  // cards.
  // View item renderer.
  var render = RenderHand();
  render({ parentSelector: '.hand-root', viewStore });
}
