var curry = require('lodash.curry');

function MemoryPersister() {
  var stuff = {};

  return {
    write: writeThing,
    delete: deleteThing,
    get: getThing
  };

  function writeThing(thing) {
    stuff[thing.id] = thing;
  }

  function deleteThing(id) {
    delete stuff[id];
  }

  // TODO: Validate?
  function getThing(id) {
    return stuff[id];
  }
}

function IdsMemoryPersister() {
  var idsForTypes = {};

  return {
    write: curry(writeIds)('ids__test'),
    get: curry(getIds)('ids__test'),
    delete: noOp
  };

  function getIds(idsKey) {
    var ids = [];
    const idsString = idsForTypes[idsKey];
    if (idsString && idsString.length > 0) {
      ids = idsString.split(',');
    }
    return ids;
  }

  function writeIds(idsKey, ids) {
    const idsString = ids.join(',');
    idsForTypes[idsKey] = idsString;
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noOp() {}

module.exports = { MemoryPersister, IdsMemoryPersister };
