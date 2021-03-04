var test = require('tape');
var { ThingStore } = require('./build/wily.js/stores.js');
var { MemoryPersister } = require('./fixtures/memory-persister');

var store = ThingStore(MemoryPersister(), 5);

var cbCallCounts = [0, 0];
var cbExpected = [[6], [6, 7, 8]];
var currentTest;

test('Get', testGet);
test('Store subscriptions', testSubscriptions);
test('Unsubscribe', testUnsubscribe);
test('Unsubscribe specific callback', testUnsubscribeSpecific);
test('Unsubscribe remaining', testUnsubscribeRemaining);

function testGet(t) {
  t.equal(store.get(), 5, 'get works.');
  t.end();
}

function testSubscriptions(t) {
  t.plan(2);
  currentTest = t;

  store.subscribe(cb1);
  store.subscribe(cb2);
  store.set(6);
}

function testUnsubscribe(t) {
  t.plan(1);
  currentTest = t;

  store.unsubscribe(cb1);
  store.set(7);
}

function testUnsubscribeSpecific(t) {
  // cb1 is already unsubscribed, so cb2 should still get called.
  t.plan(1);
  currentTest = t;

  store.unsubscribe(cb1);
  store.set(8);
}

function testUnsubscribeRemaining(t) {
  currentTest = t;

  store.unsubscribe(cb2);
  store.unsubscribe(cb2);
  store.set(9);

  setTimeout(checkCallCount, 500);

  function checkCallCount() {
    t.equal(cbCallCounts[0], 1, 'Callback 1 not called after unsubscribing.');
    t.equal(cbCallCounts[1], 3, 'Callback 2 not called after unsubscribing.');
    t.end();
  }
}

function cb1(aStore) {
  currentTest.equal(
    aStore.get(),
    cbExpected[0][cbCallCounts[0]],
    'Subscriber 1 gets updated value.'
  );
  cbCallCounts[0] += 1;
}

function cb2(aStore) {
  currentTest.equal(
    aStore.get(),
    cbExpected[1][cbCallCounts[1]],
    'Subscriber 2 gets updated value.'
  );
  cbCallCounts[1] += 1;
}
