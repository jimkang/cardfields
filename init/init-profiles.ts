import { writeThing, getThing, getIds, writeIds } from '../stores/local-storage';
import type { Profile } from '../types';

export function initProfiles(): string[] {
  var mainProfile = getThing('profile__main');
  var profileIds = getIds('ids__profile');
  if (!profileIds) {
    profileIds = [];
  }
  if (!mainProfile) {
    let defaultMain: Profile = {
      id: 'profile__main',
      title: 'Main',
      piles: [] // TODO: allCards
    };
    writeThing(defaultMain);
    mainProfile = defaultMain;
    profileIds.push(mainProfile.id);
  }
  writeIds('ids__profile', profileIds);

  return profileIds;
}
