import { StoreType, Thing } from '../types';

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
