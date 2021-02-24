//import type { Card } from '../../types';
import { select } from 'd3-selection';
var container = {};

var resolved = Promise.resolve();

function Store(val) {
  var value = val;
  var subscribers = [];

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
    subscribers.forEach(callSubscriber);
  }

  function callSubscriber(subscriber) {
    resolved.then(() => subscriber(store));
  }
}

// This takes input and updates stores.
function Update(store) {
  var render = Render({ rootSel: '.root' });
  store.subscribe(update);

  return update;

  function update(store) {
    render(store);
  }
}

// This renders objects and handles UI events.
function Render({ rootSel }) {
  var rootEl = document.querySelector(rootSel);

  return render;

  function render(store) {
    rootEl.innerHTML = `<div class="name" contenteditable="true">${
      store.get().name
    }</div>`;
    select(rootEl)
      .select('.name')
      .on('blur', setName);

    function setName() {
      store.setPart({ name: select(this).text() });
    }
  }
}

var store = Store({ name: 'Joe' });
var update = Update(store);

update(store);

console.log('hey');

export default container;
