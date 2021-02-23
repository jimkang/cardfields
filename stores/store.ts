import { writable } from 'svelte/store';
import type { Thing } from '../types';

export function Store<T extends Thing>(writeThing, deleteThing, obj: T) {
  var store = writable(obj);

  return {
    set(value: T) {
      console.log('Setting', value);
      writeThing(value);
      store.set(value);
      obj = value;
    },
    update: store.update,
    subscribe: store.subscribe,
    delete() {
      deleteThing(obj.id);
    },
    get() {
      return obj;
    }
  };
}

