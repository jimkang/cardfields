import type { Writable } from 'svelte/store';

export interface ThingStore<ThingType> extends Writable<ThingType> {
  delete: () => void;
}

