import { cardsContainerClass, pilesContainerClass } from '../consts';
import type { ThingStoreType } from '../types';

export function OnEstablishPilesContainer(
  pileStores: ThingStoreType[],
  onPileChangeFns
) {
  return onEstablishElement;

  function onEstablishElement(el) {
    if (el.classList.contains(pilesContainerClass)) {
      onPileChangeFns.forEach((onPileChange, i) => onPileChange(pileStores[i]));
    }
  }
}

export function OnEstablishCardsCardsContainer(
  cardStores: ThingStoreType[],
  onCardChangeFns
) {
  return onEstablishElement;

  function onEstablishElement(el) {
    if (el.classList.contains(cardsContainerClass)) {
      onCardChangeFns.forEach((onCardChange, i) => onCardChange(cardStores[i]));
    }
  }
}
