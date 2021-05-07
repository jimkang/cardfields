import { StoreType, Thing, CardPt } from '../types';

export function OnEstablishContainerForChildren(
  stores: StoreType<Thing>[],
  onChangeFns,
  containerClass: string
) {
  return onEstablishElement;

  function onEstablishElement(el) {
    if (el.classList.contains(containerClass)) {
      onChangeFns.forEach((onItemChange, i) => onItemChange(stores[i]));
    }
  }
}

export function OnEstablishCardContainer(
  storeRegistry,
  renderCard: (CollectionStoreType, StoreType, object) => void
) {
  return onEstablishCardContainer;

  function onEstablishCardContainer(cardPt: CardPt) {
    renderCard(
      storeRegistry.getCollectionStore('card', null),
      storeRegistry.getStore(cardPt.cardId),
      this
    );
  }
}
