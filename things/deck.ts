import { Deck, Persister } from "../types";

export function RehydrateDeck(thingPersister: Persister) {
  return rehydrateDeck;
  
  // These functions should not mess with val.
  function rehydrateDeck(val): Deck {
    if (!val.piles) {
      return;
    }
    var rehydrated = Object.assign({}, val, { piles: val.piles.map(getPileForId) });
    // What about rehydrating the properties of each pile?
    return rehydrated;
  }

  function getPileForId(id: string) {
    return thingPersister.get(id);
  }
}

export function DehydrateDeck(thingPersister: Persister) {
  return dehydrateDeck;
  
  function dehydrateDeck(val): Deck {
    if (!val.piles) {
      return val;
    }
    // TODO: Maybe deep copy?
    var dehydrated = Object.assign({}, val, { piles: val.piles.map(pile => pile.id) });
    return dehydrated;
  }
}