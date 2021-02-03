import type { Thing, ThingConflictPair } from '../types';
import pluck from 'lodash.pluck';

function checkForImportConflict<T extends Thing>(existingIds: string[], allThings: T[], conflictPairs: ThingConflictPair[], thing: T, index: number): boolean {
  if (existingIds.includes(thing.id)) {
    let incumbent = allThings[existingIds.indexOf(thing.id)];

    conflictPairs.push({ id: `conflict-${index}`, incumbent, challenger: thing });
    return true;
  }
  return false;
}

// Modifies conflictPairs.
export function importThings<T extends Thing>(things: T[], allThings: T[], conflictPairs: ThingConflictPair[], addThing: (Thing) => void) {
  var existingIds: string[] = pluck(allThings, 'id');
  var importCount = 0;
  things.forEach(importThing);
  return importCount;

  function importThing(thing: T, index: number) {
    if (!checkForImportConflict(existingIds, allThings, conflictPairs, thing, index)) {
      addThing(thing);
      importCount += 1;
    }
  }
}

