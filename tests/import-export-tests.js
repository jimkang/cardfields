require('longjohn');
var test = require('tape');
var assertNoError = require('assert-no-error');

var initialFieldFlow = require('../flows/initial-cardfields-flow.ts');
var PouchDB = require('pouchdb');

// TODO: Everything!
// Create a project, export it, check the export.
// Import a project, check it.

var testCases = [
  {
    name: 'Nothing in db yet, so it initializes with a cardfields',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: true,
    opts: {
      cardfieldsId: 'smidgeo-cardfields'
    }
  },
  {
    name: 'No cardfieldsId provided, so it returns a store, and a recent cardfields',
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
      'Could not load the cardfields with the id nonexistent-cardfields. Try picking another cardfields?',
    opts: {
      cardfieldsId: 'nonexistent-cardfields'
    }
  },
  {
    name: 'Field is in db',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: false,
    expectedFieldStoreId: 'smidgeo-cardfields',
    opts: {
      cardfieldsId: 'smidgeo-cardfields'
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
          typeof result.cardfieldsStore.saveAll,
          'function',
          'cardfieldsStore is provided by flow.'
        );
        if (testCase.expectedFieldStoreFieldId) {
          t.equal(
            result.cardfieldsStore.getFieldId(),
            result.cardfieldsStoreFieldId,
            'Id of cardfields is correct.'
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
