//import type { Card } from '../../types';
import type { Thing } from '../../types';
import { select } from 'd3-selection';
import { writeThing, deleteThing, getThing, writeIds, getIds } from '../../stores/local-storage';
import curry from 'lodash.curry';
import pluck from 'lodash.pluck';
import compact from 'lodash.compact';
import { v4 as uuid } from 'uuid';

var container = {};

var resolved = Promise.resolve();

var aPersister = {
  write: writeThing, delete: deleteThing, get: getThing
};

function Store<T>(persister, val: T, dehydrate?: (T) => void, rehydrate?: (any) => T) {
  var value;
  var subscribers = [];
  set(val);

  var store = {
    get() {
      if (rehydrate) {
        return rehydrate(value);
      }
      return value;
    },
    getRaw() {
      return value;
    },
    set,
    setRaw,
    setPart(val) {
      if (typeof val !== 'object') {
        throw new Error('setPart cannot be used on a non-object value.');
      }
      set(Object.assign(value, val));
    },
    subscribe(fn) {
      subscribers.push(fn);
    }
    //delete() {}
  };

  return store;

  function set(val) {
    if (dehydrate) {
      setRaw(dehydrate(val));
    } else {
      setRaw(val);
    }
  }

  function setRaw(val) {
    console.log('Setting', val);
    value = val;
    persister.write(value);
    subscribers.forEach(callSubscriber);
  }

  function callSubscriber(subscriber) {
    resolved.then(() => subscriber(store));
  }
}

function CollectionStore(vals: Thing[]) {
  var idsPersister = {
    write: curry(writeIds)('ids__test'),
    get: curry(getIds)('ids__test'),
    delete: noOp
  }; 
  var base = Store<Thing[]>(idsPersister, vals, dehydrate, rehydrate);

  return Object.assign({}, base, { add, remove });

  function dehydrate(things) {
    return pluck(things, 'id');
  }

  function rehydrate(ids) {
    return ids.map(getThing);
  }
  
  function add(thing: Thing) {
    // TODO: Dupes
    var ids = base.getRaw();
    ids.push(thing.id);
    base.setRaw(ids);
  }

  function remove(thing: Thing) {
    var ids = base.getRaw();
    const index = ids.indexOf(thing.id);
    ids.splice(index, 1);
    base.setRaw(ids);
  }
}

//function loadStore(id: string) {
//var thing = getThing(id);
//if (thing) {
//return Store(aPersister, thing);
//}
//}

// This takes input and updates stores.
function Update(store) {
  var render = Render({ parentSelector: `#${store.get().id}` });
  store.subscribe(update);

  return update;

  function update(store) {
    render(store);
  }
}

function UpdateCollection(collectionStore, ItemUpdate) {
  var itemUpdates;

  var renderCollection = RenderCollection({ parentSelector: '.root' });
  collectionStore.subscribe(updateCollection);

  return updateCollection;

  function updateCollection(collectionStore) {
    renderCollection(collectionStore);

    var itemStores = collectionStore.get().map(thing => Store(aPersister, thing));
    itemUpdates = itemStores.map(ItemUpdate);
    itemUpdates.forEach((update, i) => update(itemStores[i]));
  }
}

// This renders objects and handles UI events.
function Render({ parentSelector }) {
  var parentSel = select(parentSelector);
  return render;

  function render(store) {

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
        .attr('class', 'add-thing-button')
        .on('click', removeThing);
    }

    function removeThing() {
      // Need the collection for this!?
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
      var newStore = Store(aPersister, { id: `thing-${uuid()}`, name: 'Shabadoo' });
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
var collectionStore = CollectionStore(loadThings('ids__test'));

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
