//import type { Card } from '../../types';
import type { Thing } from '../../types';
import { select } from 'd3-selection';
import { writeThing, deleteThing, getThing, writeIds, getIds } from '../../stores/local-storage';
import curry from 'lodash.curry';
import pluck from 'lodash.pluck';
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

function loadStore(id: string) {
  var thing = getThing(id);
  if (thing) {
    return Store(aPersister, thing);
  }
}

// This takes input and updates stores.
function Update(store) {
  var render = Render({ parentSel: '.root' });
  store.subscribe(update);

  return update;

  function update(store) {
    render(store);
  }
}

// This renders objects and handles UI events.
function Render({ parentSel }) {
  var parentEl = document.querySelector(parentSel);

  return render;

  function render(store) {
    var nameSel = establish(parentEl, 'div', `#${store.get().id}`, initName);
    nameSel.text(store.get().name);

    establish(parentEl, 'button', '.remove-thing-button', initRemoveButton);

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

function RenderCollectionControls({ parentSel }) {
  var parentEl = document.querySelector(parentSel);

  return renderCollectionControls;

  function renderCollectionControls(collectionStore) {
    establish(parentEl, 'button', '.add-thing-button', initAddButton);

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

var stores = [
  loadStore('joe') || Store(aPersister, { id: 'joe', name: 'Joe' }),
  loadStore('bob') || Store(aPersister, { id: 'bob', name: 'Bob' })
];

var collectionStore = CollectionStore(stores.map(s => s.get()));

//var updates = stores.map(Update);
// TODO: Move some of this into a getStores on 
// CollectionStore.
var updates = collectionStore.get().map(thing => Store(aPersister, thing)).map(Update);

updates.forEach((update, i) => update(stores[i]));

// No update fn for the collection controls.
var renderCollectionControls = RenderCollectionControls({ parentSel: '.collection-controls' });
renderCollectionControls(collectionStore);

function establish(parentEl, childTag, childSelector, initFn) {
  var parentSel = select(parentEl);
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
