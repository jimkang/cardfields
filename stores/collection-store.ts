import { writable } from 'svelte/store';

// This store deals with ids, not with hydrated
// objects.
export function CollectionStore({
  getIds,
  writeIds,
  collectionKey
}: {
  getIds;
  writeIds;
  collectionKey: string;
}) {
  var ids = getIds(collectionKey);
  if (!ids) {
    ids = [];
  }

  var store = writable(ids);

  return {
    set,
    update: store.update,
    subscribe: store.subscribe,
    add(id: string) {
      ids.push(id);
      set(ids);
    },
    get() {
      return ids;
    }
  };

  function set(values: string[]) {
    console.log('Setting values', values);
    writeIds(values);
    store.set(values);
    ids = values;
  }
}
