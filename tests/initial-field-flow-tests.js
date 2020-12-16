require('longjohn');
var test = require('tape');
var assertNoError = require('assert-no-error');

var initialFieldFlow = require('../flows/initial-chaos-galaxies-flow.ts');
var PouchDB = require('pouchdb');

var testCases = [
  {
    name: 'Nothing in db yet, so it initializes with a chaos-galaxies',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: true,
    opts: {
      chaos-galaxiesId: 'smidgeo-chaos-galaxies'
    }
  },
  {
    name: 'No chaos-galaxiesId provided, so it returns a store, and a recent chaos-galaxies',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: true,
    opts: {}
  },
  {
    name: 'Field is in db but not the one with the requested id',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: false,
    expectedMessage:
      'Could not load the chaos-galaxies with the id nonexistent-chaos-galaxies. Try picking another chaos-galaxies?',
    opts: {
      chaos-galaxiesId: 'nonexistent-chaos-galaxies'
    }
  },
  {
    name: 'Field is in db',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: false,
    expectedFieldStoreId: 'smidgeo-chaos-galaxies',
    opts: {
      chaos-galaxiesId: 'smidgeo-chaos-galaxies'
    }
  }
];

testCases.forEach(runCase);

function runCase(testCase) {
  test(testCase.name, runTest);

  function runTest(t) {
    var db = new PouchDB('tests/fixtures/test-' + testCase.dbName);
    initialFieldFlow(Object.assign({ db }, testCase.opts), checkResult);

    function checkResult(error, result) {
      if (testCase.expectError) {
        t.ok(error, 'Flow calls back with error.');
      } else {
        assertNoError(t.ok, error, 'No error while running flow.');
      }

      if (testCase.expectStore) {
        t.equal(
          typeof result.store.loadField,
          'function',
          'store is provided by flow.'
        );
      }
      if (testCase.expectFieldStore) {
        t.equal(
          typeof result.chaos-galaxiesStore.saveAll,
          'function',
          'chaos-galaxiesStore is provided by flow.'
        );
        if (testCase.expectedFieldStoreFieldId) {
          t.equal(
            result.chaos-galaxiesStore.getFieldId(),
            result.chaos-galaxiesStoreFieldId,
            'Id of chaos-galaxies is correct.'
          );
        }
      }
      if (testCase.expectedMessage) {
        t.equal(
          result.message,
          testCase.expectedMessage,
          'Expected message is provided.'
        );
      }
      t.end();
    }
  }
}
