//import type { Card } from '../../types';
import { ThingStore, CollectionStore } from '../../wily.js/stores';
import type { Profile, ThingStoreType } from '../../types';
import { thingPersister, IdsPersister, loadThings} from '../../wily.js/persistence/local';
import { v4 as uuid } from 'uuid';
import { UpdateCollection } from '../../wily.js/updaters/basic-updaters';
import { UpdateProfile } from '../../updaters/updaters';
import { AddThing } from '../../wily.js/downdaters/collection-modifiers';
import { RenderProfile, RenderProfileCollection } from '../../renderers/profile-renderers';

var container = {};
const idsKey = 'ids__profiles';
var idsPersister = IdsPersister(idsKey);

var collectionStore = CollectionStore(idsPersister, thingPersister, loadThings(idsKey));
var profileStores = collectionStore.get().map(thing => ThingStore(thingPersister, thing));
var activeProfileStore = ThingStore(thingPersister, { id: 'active-profile', profile: '' });
var addThing = AddThing(collectionStore, createNewProfile, thingPersister, createItemUpdater);

var renderCollection = RenderProfileCollection({ parentSelector: '.root', addThing });

var updateCollection = UpdateCollection(renderCollection, collectionStore);
updateCollection(collectionStore);
var updateItems = profileStores.map(createItemUpdater);
updateItems.forEach((update, i) => update(profileStores[i])); 

function createItemUpdater(store: ThingStoreType) {
  return UpdateProfile(RenderProfile({ parentSelector: `#${store.get().id}`  }), collectionStore, activeProfileStore, store);
}

function createNewProfile(): Profile {
  return { id: `profile-${uuid()}`, name: 'Shabadoo', piles: [] };
}

export default container;
