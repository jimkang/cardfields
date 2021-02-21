// Singleton for persisting to localStorage.

import type { Thing } from '../types';

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
  // TODO: Safe parse
  return JSON.parse(localStorage.getItem(id));
}

