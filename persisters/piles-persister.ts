import type { Pile, Persister, ThingStoreType } from '../types';

export function PilesPersister(deckStore: ThingStoreType): Persister {
  return {
    write(pileIds: string[]) {
      // write gets called by CollectionStore (because piles is a collection)
      // which works with raw ids, not objects.
      deckStore.setRaw(Object.assign({}, deckStore.getRaw(), { piles: pileIds }));
    },
    delete() {
      deckStore.setPart({ piles: [] });
    },
    get() {
      return deckStore.getRaw().piles;
    },
  };
}
