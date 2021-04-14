import { cardsContainerClass, pilesContainerClass } from '../consts';
import { StoreType, Thing } from '../types';

export function OnEstablishPilesContainer(
  pileStores: StoreType<Thing>[],
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
  cardStores: StoreType<Thing>[],
  onCardChangeFns
) {
  return onEstablishElement;

  function onEstablishElement(el) {
    if (el.classList.contains(cardsContainerClass)) {
      onCardChangeFns.forEach((onCardChange, i) => onCardChange(cardStores[i]));
    }
  }
}
