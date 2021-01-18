import { writable } from 'svelte/store';
import type { Pile } from '../things/pile';
import type { ThingStore } from './store-types';

export interface PileStoreType extends ThingStore<Pile> {
  delete: () => void;
}

export default function PileStore(state, pile): PileStoreType {
  var store = writable(pile);

  return {
    set(value: Pile) {
      console.log('Setting', value);
      state.persistThing(value);
      store.set(value);
      pile = value;
    },
    update: store.update,
    subscribe: store.subscribe,
    delete() {
      state.deletePile(pile.id);
    }
  };
}

