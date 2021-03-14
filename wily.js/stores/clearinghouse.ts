import type { ThingStoreType } from '../../types';

// This is not for collections. Let's see if we actually
// need one for collections later.
export function Clearinghouse() {
  var storesById: Record<string, ThingStoreType> = {};

  return {
    getStore,
    putStore,
    delStore,
  };

  function getStore(id: string): ThingStoreType {
    return storesById[id];
  }

  function putStore(store: ThingStoreType): ThingStoreType {
    storesById[store.get().id] = store;
    return store;
  }

  function delStore(id: string): void {
    delete storesById[id];
  }
}

export var clearinghouse = Clearinghouse();
