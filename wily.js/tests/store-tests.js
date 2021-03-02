/* global process */
var test = require('tape');
var assertNoError = require('assert-no-error');
var { ThingStore } = require('./build/wily.js/stores.js');
var { MemoryPersister } = require('./fixtures/memory-persister');

var store = ThingStore(MemoryPersister(), 5);

var testCases = [
  {
    name: 'Get.',
    method: 'get',
    expected: 5
  }
];

testCases.forEach(runTest);

function bail() {
  console.log('Bailing!');
  process.exit();
}

function runTest(testCase) {
  test(testCase.name, testStore);

  function testStore(t) {
    var result = store[testCase.method]();
    t.deepEqual(result, testCase.expected, 'Result is correct.');
    t.end();
    /*
    // This breaks the type checking, but it's worth it for simpler tests.
    var opts = getOpts(testCase);
    if (opts) {
      store[testCase.method](opts, checkResult);
    } else {
      store[testCase.method](checkResult);
    }

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
}

function getOpts(testCase) {
  if (testCase.opts && !testCase.doNotModOpts) {
    if (Array.isArray(testCase.opts)) {
      return testCase.opts.map(
        curry(addPropToParams)('userid', testCase.userid)
      );
    } else {
      return addPropToParams('userid', testCase.userid, testCase.opts);
    }
  }

  return testCase.opts;
}

function handleError(error) {
  console.error(error);
}
