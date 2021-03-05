// Singleton for persisting to localStorage.

import type { Thing, Persister } from '../../types';
import compact from 'lodash.compact';
import curry from 'lodash.curry';
import { noThrowJSONParse as parse } from '../utils/no-throw-json-parse';

export function writeThing(thing: Thing) {
  localStorage.setItem(thing.id, JSON.stringify(thing));
}
  
export function deleteThing(id: string) {
  localStorage.removeItem(id);
}

export function getIds(idsKey: string): string[] {
  var ids = [];
  const idsString = localStorage.getItem(idsKey);
  if (idsString && idsString.length > 0) {
    ids = idsString.split(',');
  }
  return ids;
}

export function writeIds(idsKey: string, ids: string[]) {
  const idsString = ids.join(',');
  localStorage.setItem(idsKey, idsString);
}

// TODO: Validate?
export function getThing(id: string) {
  return parse(localStorage.getItem(id));
}

export function loadThings(idsKey: string): Thing[] {
  const ids = localStorage.getItem(idsKey);
  var things: Thing[] = [];
  if (ids && ids.length > 0) {
    things = ids.split(',').map(getThingFromLocalStorage) as Thing[];
  }
  things = compact(things);
  return things;
}

export function getThingFromLocalStorage(id: string): Thing {
  return parse(localStorage.getItem(id)) as Thing;
}

export var thingPersister: Persister = {
  write: writeThing, delete: deleteThing, get: getThing
};

export function IdsPersister(idsKey: string) {
  return {
    write: curry(writeIds)(idsKey),
    get: curry(getIds)(idsKey),
    delete: noOp
  }; 
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function noOp() {}
