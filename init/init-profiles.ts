import { writeThing, getThing, getIds, writeIds } from '../stores/local-storage';
import type { Profile } from '../types';
import { profileIdsKey, mainProfileId } from '../names';

// This doesn't use clearinghouse, so components
// won't get notified of the changes made here,
// which is OK.
export function initProfiles(): string[] {
  var mainProfile = getThing(mainProfileId);
  var profileIds = getIds(profileIdsKey);
  if (!profileIds) {
    profileIds = [];
  }
  if (!mainProfile) {
    let defaultMain: Profile = {
      id: mainProfileId,
      title: 'Main',
      piles: [] // TODO: allCards
    };
    writeThing(defaultMain);
    mainProfile = defaultMain;
    profileIds.push(mainProfile.id);
  }
  writeIds(profileIdsKey, profileIds);

  return profileIds;
}
