//import type { Card } from '../../types';
import { CollectionStore } from '../../wily.js/stores/stores';
import { select } from 'd3-selection';
import { thingPersister, IdsPersister, loadThings } from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { establish } from '../../wily.js/rendering/establish';
import { Update, UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';
import { CollectionStoreType, StoreType, Thing } from '../../types';
import { Store } from '../../wily.js/stores/stores';

var container = {};

const idsKey = 'ids__test';
var idsPersister = IdsPersister(idsKey);
var collectionStore = CollectionStore(idsPersister, thingPersister, loadThings(idsKey));
var addThing = AddThing(collectionStore, createNewThing, thingPersister, createItemUpdater);
var renderCollection = RenderCollection({ parentSelector: '.root', addThing });
var updateCollection = UpdateCollection(renderCollection, collectionStore);
updateCollection(collectionStore);
var itemStores = collectionStore.get().map(thing => Store<Thing>(thingPersister, thing));
var updateItems = itemStores.map(createItemUpdater);
updateItems.forEach((update, i) => update(itemStores[i]));

// This renders objects and handles UI events.
function Render({ parentSelector }) {
  return render;

  function render(collectionStore: CollectionStoreType, store: StoreType<Thing>) {

    var parentSel = select(parentSelector);
    var nameSel = establish(parentSel, 'div', `#${store.get().id}`, initName);
    nameSel.text(store.get().name);

    establish(parentSel, 'button', '.remove-thing-button', initRemoveButton);

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
        .attr('class', 'remove-thing-button')
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
  var itemRoot = parentSel.select('.item-root');
  var controlsParent = parentSel.select('.collection-controls');

  return renderCollection;

  function renderCollection(collectionStore) {
    establish(controlsParent, 'button', '.add-thing-button', initAddButton);
  
    var ids = collectionStore.getRaw();
    var containers = itemRoot.selectAll('.item-container').data(ids, x => x);
    containers.exit().remove();
    containers.enter()
      .append('li')
      .classed('item-container', true)
      .attr('id', x => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-thing-button')
        .text('Add a thing')
        .on('click', addThing);
    }

  }
}

function createItemUpdater(store: StoreType<Thing>) {
  return Update(Render({ parentSelector: `#${store.get().id}`}), collectionStore, store);
}

function createNewThing(){
  return { id: `thing-${uuid()}`, name: 'Shabadoo' };
}
export default container;
