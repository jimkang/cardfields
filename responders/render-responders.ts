import type { ThingStoreType } from '../types';

export function OnEstablishPilesContainer(
  pileStores: ThingStoreType[],
  onPileChangeFns
) {
  return onEstablishElement;

  function onEstablishElement(el) {
    if (el.classList.contains('pile-collection-container')) {
      onPileChangeFns.forEach((onPileChange, i) => onPileChange(pileStores[i]));
    }
  }
}
