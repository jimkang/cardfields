import { writable } from 'svelte/store';
import type { Profile } from '../types';

export function ProfileStore(writeThing, deleteThing, profile: Profile) {
  var store = writable(profile);

  return {
    set(value: Profile) {
      console.log('Setting', value);
      writeThing(value);
      store.set(value);
      profile = value;
    },
    update: store.update,
    subscribe: store.subscribe,
    delete() {
      deleteThing(profile.id);
    },
  };
}

