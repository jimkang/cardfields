var test = require('tape');
//var assertNoError = require('assert-no-error');
var { ThingStore } = require('./build/wily.js/stores.js');
var { MemoryPersister } = require('./fixtures/memory-persister');

var store = ThingStore(MemoryPersister(), 5);

var cbCallCounts = [0, 0];
var cbExpected = [[6], [6, 7]];
var currentTest;

test('Get', testGet);
test('Store subscriptions', testSubscriptions);
test('Unsubscribe', testUnsubscribe);

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
