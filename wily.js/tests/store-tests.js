var test = require('tape');
//var assertNoError = require('assert-no-error');
var { ThingStore } = require('./build/wily.js/stores.js');
var { MemoryPersister } = require('./fixtures/memory-persister');

test('Store subscriptions', testSubscriptions);

function testSubscriptions(t) {
  t.plan(2);

  var store = ThingStore(MemoryPersister(), 5);

  t.equal(store.get(), 5, 'get works.');

  store.subscribe(cb1);
  store.set(6);

  function cb1(aStore) {
    t.equal(aStore.get(), 6, 'Subscriber gets updated value.');
  }

  /*
    function checkResult(error, value) {
      if (testCase.errorMsg) {
        t.equal(error.message, testCase.errorMsg, 'Error message is correct.');
        if (testCase.errorInfo) {
          console.log('error check', error.message);
          t.deepEqual(
            VError.info(error),
            testCase.errorInfo,
            'Error info is correct.'
          );
        }
      } else {
        console.log('Error:', error);
        assertNoError(t.ok, error, 'No error as expected.');
        if (testCase.value) {
          if (Array.isArray(testCase.value)) {
            testCase.value.forEach((expectedItem, i) =>
              t.deepEqual(value[i], expectedItem, 'Value element is correct.')
            );
          } else {
            t.deepEqual(value, testCase.value, 'Value is correct.');
          }
        }
      }
      t.end();
    }
*/
}
