import type {
  Thing,
  Persister,
  ThingStoreType,
  CollectionStoreType,
  StoreType,
} from '../../types';
import pluck from 'lodash.pluck';

var resolved = Promise.resolve();

export function Store<T>(
  persister: Persister,
  val: T,
  dehydrate?: (T) => void,
  rehydrate?: (any) => T
): StoreType<T> {
  var value;
  var subscribers = [];
  set(val);

  var store: StoreType<T> = {
    get() {
      if (rehydrate) {
        return rehydrate(value);
      }
      return value;
    },
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
      set(Object.assign(value, val));
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

  function callSubscriber(subscriber) {
    resolved.then(() => subscriber(store));
  }
}

export function ThingStore(
  persister: Persister,
  val: Thing,
  dehydrate?: (Thing) => void,
  rehydrate?: (any) => Thing
): ThingStoreType {
  var base = Store<Thing>(persister, val, dehydrate, rehydrate);

  return Object.assign(base, { del });

  function del() {
    var value: Thing = base.get();
    if (value) {
      persister.delete(value.id);
    }
    base.setValue(null);
  }
}

export function CollectionStore(
  idsPersister: Persister,
  thingPersister: Persister,
  kind: string,
  parentThingId: string,
  vals: Thing[]
): CollectionStoreType {
  var base = Store<Thing[]>(idsPersister, vals, dehydrate, rehydrate);

  return Object.assign(base, { add, remove, kind, parentThingId });
  function dehydrate(things) {
    return pluck(things, 'id');
  }

  function rehydrate(ids) {
    return ids.map(thingPersister.get);
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
