//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { ThingStoreType, CollectionStoreType } from '../../types';
import { select } from 'd3-selection';
import { thingPersister, IdsPersister, loadThings } from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { establish } from '../../wily.js/rendering/establish';
import { Update, UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';

var container = {};
const idsKey = 'ids__profiles';
var idsPersister = IdsPersister(idsKey);

var collectionStore = CollectionStore(idsPersister, thingPersister, loadThings(idsKey));
var addThing = AddThing(collectionStore, createNewProfile, thingPersister, createItemUpdater);
var renderCollection = RenderCollection({ parentSelector: '.root', addThing });
var updateCollection = UpdateCollection(renderCollection, collectionStore);
updateCollection(collectionStore);
var itemStores = collectionStore.get().map(thing => ThingStore(thingPersister, thing));
var updateItems = itemStores.map(createItemUpdater);
updateItems.forEach((update, i) => update(itemStores[i]));

// This renders objects and handles UI events.
function Render({ parentSelector }) {
  return render;

  function render(collectionStore: CollectionStoreType, store: ThingStoreType) {

    var parentSel = select(parentSelector);
    var nameSel = establish(parentSel, 'div', `#${store.get().id}`, initName);
    nameSel.text(store.get().name);

    establish(parentSel, 'button', '.remove-profile-button', initRemoveButton);

    function initName(sel) {
      sel
        .attr('id', store.get().id)
        .attr('class', 'name')
        .attr('contenteditable', true)
        .on('blur', setName);
    }

    function setName() {
      store.setPart({ name: select(this).text() });
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-profile-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function removeThing() {
      collectionStore.remove(store.get());
      store.del();
    }
  }
}

function RenderCollection({ parentSelector, addThing }) {
  var parentSel = select(parentSelector);
  var itemRoot = parentSel.select('.profiles-root');
  var controlsParent = parentSel.select('.profiles-collection-controls');

  return renderCollection;

  function renderCollection(collectionStore) {
    establish(controlsParent, 'button', '.add-profile-button', initAddButton);
  
    var ids = collectionStore.getRaw();
    var containers = itemRoot.selectAll('.item-container').data(ids, x => x);
    containers.exit().remove();
    containers.enter()
      .append('li')
      .classed('item-container', true)
      .attr('id', x => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-profile-button')
        .text('Add a profile')
        .on('click', addThing);
    }
  }
}

function createItemUpdater(store: ThingStoreType) {
  return Update(Render({ parentSelector: `#${store.get().id}`}), collectionStore, store);
}

function createNewProfile(){
  return { id: `profile-${uuid()}`, name: 'Shabadoo' };
}

export default container;
