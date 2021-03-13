import type { Pile, Persister, ThingStoreType } from '../types';

export function PilesPersister(deckStore: ThingStoreType): Persister {
  return {
    write(piles: Pile[]) {
      deckStore.setPart({ piles });
    },
    delete() {
      deckStore.setPart({ piles: [] });
    },
    get() {
      return deckStore.get().piles;
    },
  };
}
