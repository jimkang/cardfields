//import type { Card } from '../../types';
import type { Thing } from '../../types';
import { select } from 'd3-selection';
import { writeThing, deleteThing, getThing } from '../../stores/local-storage';

var container = {};

var resolved = Promise.resolve();

var aPersister = {
  writeThing, deleteThing, getThing
};

function Store(persister, val: Partial<Thing>) {
  var value;
  var subscribers = [];
  set(val);

  var store = {
    get() {
      return value;
    },
    set,
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
    console.log('Setting', val);
    value = val;
    persister.writeThing(val);
    subscribers.forEach(callSubscriber);
  }

  function callSubscriber(subscriber) {
    resolved.then(() => subscriber(store));
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
  }
}

var stores = [
  loadStore('joe') || Store(aPersister, { id: 'joe', name: 'Joe' }),
  loadStore('bob') || Store(aPersister, { id: 'bob', name: 'Bob' })
];

var updates = stores.map(Update);

updates.forEach((update, i) => update(stores[i]));

console.log('hey');

function establish(parentEl, childTag, childSelector, initFn) {
  var parentSel = select(parentEl);
  var childSel = parentSel.select(childSelector);
  if (childSel.empty()) {
    childSel = parentSel.append(childTag);
    initFn(childSel);
  }
  return childSel;
}

export default container;
