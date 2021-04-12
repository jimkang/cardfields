import type { Persister, ThingStoreType } from '../types';

// This might be causing piles to be an object
// instead of an array!
export function PiggybackPersister(
  parentStore: ThingStoreType,
  collectionProp: string
): Persister {
  return {
    write(ids: string[]) {
      // write gets called by CollectionStore (because piles is a collection)
      // which works with raw ids, not objects.

      // We need to call setRaw, not set here, because
      // the value is already properly dehydrated, and we don't
      // want to try to dehydrate something that is already
      // dehydrated.
      parentStore.setRaw(
        Object.assign({}, parentStore.getRaw(), { [collectionProp]: ids })
      );
    },
    delete() {
      parentStore.setPart({ [collectionProp]: [] });
    },
    get() {
      return parentStore.getRaw()[collectionProp];
    },
  };
}
