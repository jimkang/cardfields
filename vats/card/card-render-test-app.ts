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
    var nameSel = guarantee(parentEl, 'div', '.name', initName);
    nameSel.text(store.get().name);

    function initName(sel) {
      sel
        .attr('class', 'name')
        .attr('contenteditable', true)
        .on('blur', setName);
    }

    function setName() {
      store.setPart({ name: select(this).text() });
    }
  }
}

var store = Store({ name: 'Joe' });
var update = Update(store);

update(store);

console.log('hey');

function guarantee(parentEl, childTag, childSelector, initFn) {
  var parentSel = select(parentEl);
  var childSel = parentSel.select(childSelector);
  if (childSel.empty()) {
    childSel = parentSel.append(childTag);
    initFn(childSel);
  }
  return childSel;
}

export default container;
