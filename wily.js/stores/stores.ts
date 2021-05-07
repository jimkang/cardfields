import type {
  Thing,
  Persister,
  CollectionStoreType,
  StoreType,
} from '../../types';
import pluck from 'lodash.pluck';

var resolved = Promise.resolve();

// Values are always stored dehydrate and handed out
// rehydrated.
export function Store<T>(
  persister: Persister,
  val: T,
  dehydrate?: (T) => void,
  rehydrate?: (any) => T,
  alreadyPersisted?: boolean,
  initValIsAlreadyDehydrated?: boolean
): StoreType<T> {
  var value;
  var subscribers = [];
  var deleted = false;

  var transformedVal: unknown = val;
  if (!initValIsAlreadyDehydrated && dehydrate) {
    transformedVal = dehydrate(val);
  }

  if (!alreadyPersisted) {
    persister.write(transformedVal);
  }

  // No need to tell subscribers; there are none right now.
  setValue(transformedVal);

  var store: StoreType<T> = {
    get,
    getRaw() {
      return value;
    },
    set,
    setRaw,
    setValue,
    setPart(val) {
      if (typeof val !== 'object') {
        throw new Error('setPart cannot be used on a non-object value.');
      }
      // Since we are calling set, which takes a hydrated
      // value, we must use get() to get one.
      set(Object.assign(get(), val));
    },
    setPartSilent(val) {
      if (typeof val !== 'object') {
        throw new Error('setPart cannot be used on a non-object value.');
      }
      // Since we are calling set, which takes a hydrated
      // value, we must use get() to get one.
      setValue(Object.assign(get(), val));
      persister.write(value);
    },
    del,
    isDeleted() {
      return deleted;
    },
    subscribe(fn) {
      subscribers.push(fn);
    },
    unsubscribe(fn) {
      const fnIndex = subscribers.indexOf(fn);
      if (fnIndex > -1) {
        subscribers.splice(fnIndex, 1);
      }
    },
  };

  return store;

  function get() {
    if (rehydrate) {
      return rehydrate(value);
    }
    return value;
  }

  function set(val) {
    if (dehydrate) {
      setRaw(dehydrate(val));
    } else {
      setRaw(val);
    }
  }

  function setRaw(val) {
    setValue(val);
    persister.write(value);
    subscribers.forEach(callSubscriber);
  }

  function setValue(val) {
    console.log('Setting', val);
    value = val;
  }

  function del() {
    persister.delete(value);
    deleted = true;
  }

  function callSubscriber(subscriber) {
    resolved.then(() => subscriber(store));
  }
}

export function CollectionStore({
  idsPersister,
  thingPersister,
  kind,
  parentThingId,
  vals,
  itemRehydrate,
  alreadyPersisted,
  initValIsAlreadyDehydrated,
}: {
  idsPersister: Persister;
  thingPersister: Persister;
  kind: string;
  parentThingId: string;
  vals: Thing[];
  itemRehydrate?: (item: unknown) => unknown;
  alreadyPersisted?: boolean;
  initValIsAlreadyDehydrated?: boolean;
}): CollectionStoreType {
  var base = Store<Thing[]>(
    idsPersister,
    vals,
    dehydrate,
    rehydrate,
    alreadyPersisted,
    initValIsAlreadyDehydrated
  );

  return Object.assign(base, { add, remove, kind, parentThingId });

  function dehydrate(things) {
    return pluck(things, 'id');
  }

  function rehydrate(ids) {
    var items = ids.map(thingPersister.get);
    if (itemRehydrate) {
      items = items.map(itemRehydrate);
    }
    return items;
  }

  function add(thing: Thing) {
    // TODO: Dupes
    var ids = base.getRaw() as string[];
    ids.push(thing.id);
    base.setRaw(ids);
  }

  function remove(thing: Thing) {
    var ids = base.getRaw() as string[];
    const index = ids.indexOf(thing.id);
    ids.splice(index, 1);
    base.setRaw(ids);
  }
}

export function getCollectionStoreId(kind: string, parentThingId: string) {
  if (parentThingId) {
    return `ids__${kind}s__of__${parentThingId}`;
  }
  return `ids__${kind}s`;
}
