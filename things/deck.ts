import { Deck, Persister } from '../types';

export function RehydrateDeck(thingPersister: Persister) {
  return rehydrateDeck;

  // These functions should not mess with val.
  function rehydrateDeck(val): Deck {
    if (val === null || !val.piles) {
      return val;
    }

    if (val.piles.length > 0 && typeof val.piles[0] === 'object') {
      throw new Error(
        'rehydrateDeck called on possibly already-rehydrated deck.'
      );
    }

    var rehydrated = Object.assign({}, val, {
      piles: val.piles.map(getPileForId),
    });
    // What about rehydrating the properties of each pile?
    return rehydrated;
  }

  function getPileForId(id: string) {
    return thingPersister.get(id);
  }
}

export function DehydrateDeck() {
  return dehydrateDeck;

  function dehydrateDeck(val): Deck {
    if (val === null || !val.piles) {
      return val;
    }

    if (val.piles.length > 0) {
      if (typeof val.piles[0] === 'string') {
        throw new Error(
          'dehydrateDeck called on possibly already-dehydrated deck.'
        );
      }
      if (val.piles[0] === null || val.piles[0] === undefined) {
        throw new Error('dehydrateDeck called on deck with invalid pile.');
      }
    }

    var dehydrated = Object.assign({}, val, {
      piles: val.piles.map((pile) => pile.id),
    });
    return dehydrated;
  }
}
