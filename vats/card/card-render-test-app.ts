//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { Thing, Persister, ThingStoreType, CollectionStoreType } from '../../types';
import { select } from 'd3-selection';
import { writeThing, deleteThing, getThing, writeIds, getIds } from '../../stores/local-storage';
import curry from 'lodash.curry';
import compact from 'lodash.compact';
import { v4 as uuid } from 'uuid';

var container = {};

var aPersister: Persister = {
  write: writeThing, delete: deleteThing, get: getThing
};

var idsPersister = {
  write: curry(writeIds)('ids__test'),
  get: curry(getIds)('ids__test'),
  delete: noOp
}; 

//function loadStore(id: string) {
//var thing = getThing(id);
//if (thing) {
//return Store(aPersister, thing);
//}
//}

// This takes input and updates stores.
function Update(collectionStore: CollectionStoreType, store: ThingStoreType) {
  var render = Render({ parentSelector: `#${store.get().id}` });
  store.subscribe(update);

  return update;

  function update(store: ThingStoreType) {
    render(collectionStore, store);
  }
}

function UpdateCollection(collectionStore: CollectionStoreType, ItemUpdate) {
  var itemUpdates;

  var renderCollection = RenderCollection({ parentSelector: '.root' });
  collectionStore.subscribe(updateCollection);

  return updateCollection;

  function updateCollection(collectionStore: CollectionStoreType) {
    renderCollection(collectionStore);

    var itemStores = collectionStore.get().map(thing => ThingStore(aPersister, thing));
    itemUpdates = itemStores.map(curry(ItemUpdate)(collectionStore));
    itemUpdates.forEach((update, i) => update(itemStores[i]));
  }
}

// This renders objects and handles UI events.
function Render({ parentSelector }) {
  var parentSel = select(parentSelector);
  return render;

  function render(collectionStore: CollectionStoreType, store: ThingStoreType) {
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

function RenderCollection({ parentSelector }) {
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

    function addThing() {
      var newStore = ThingStore(aPersister, { id: `thing-${uuid()}`, name: 'Shabadoo' });
      collectionStore.add(newStore.get());
    }
  }
}

function loadThings(idsKeyForProfile: string): Thing[] {
  const ids = localStorage.getItem(idsKeyForProfile);
  var things: Thing[] = [];
  if (ids && ids.length > 0) {
    things = ids.split(',').map(getThingFromLocalStorage);
  }
  things = compact(things);
  return things;
}

function getThingFromLocalStorage(id: string) {
  // TODO: Safe parse
  return JSON.parse(localStorage.getItem(id));
}

//var stores = [
//loadStore('joe') || Store(aPersister, { id: 'joe', name: 'Joe' }),
//loadStore('bob') || Store(aPersister, { id: 'bob', name: 'Bob' })
//];

//var collectionStore = CollectionStore(stores.map(s => s.get()));
var collectionStore = CollectionStore(idsPersister, aPersister, loadThings('ids__test'));

//var updates = stores.map(Update);

var updateCollection = UpdateCollection(collectionStore, Update);
updateCollection(collectionStore);

function establish(parentSel, childTag, childSelector, initFn) {
  var childSel = parentSel.select(childSelector);
  if (childSel.empty()) {
    childSel = parentSel.append(childTag);
    initFn(childSel);
  }
  return childSel;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noOp() {}

export default container;
