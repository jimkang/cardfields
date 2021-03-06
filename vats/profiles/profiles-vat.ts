//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { Profile, ThingStoreType } from '../../types';
import { thingPersister, IdsPersister, loadThings} from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { Update, UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';
import { RenderProfile, RenderProfileCollection } from '../../renderers/profile-renderers';

var container = {};
const idsKey = 'ids__profiles';
var idsPersister = IdsPersister(idsKey);

var collectionStore = CollectionStore(idsPersister, thingPersister, loadThings(idsKey));
var addThing = AddThing(collectionStore, createNewProfile, thingPersister, createItemUpdater);
var renderCollection = RenderProfileCollection({ parentSelector: '.root', addThing });
var updateCollection = UpdateCollection(renderCollection, collectionStore);
updateCollection(collectionStore);
var itemStores = collectionStore.get().map(thing => ThingStore(thingPersister, thing));
var updateItems = itemStores.map(createItemUpdater);
updateItems.forEach((update, i) => update(itemStores[i])); 

function createItemUpdater(store: ThingStoreType) {
  return Update(RenderProfile({ parentSelector: `#${store.get().id}`}), collectionStore, store);
}

function createNewProfile(): Profile {
  return { id: `profile-${uuid()}`, name: 'Shabadoo', piles: [], active: false };
}

export default container;
