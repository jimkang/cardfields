import type { Persister, Pile } from '../types';

export function RehydratePile(thingPersister: Persister) {
  return rehydratePile;

  // These functions should not mess with val.
  function rehydratePile(val): Pile {
    if (val === null || !val.cards) {
      return val;
    }

    if (val.cards.length > 0 && typeof val.cards[0] === 'object') {
      throw new Error(
        'rehydratePile called on possibly already-rehydrated pile.'
      );
    }

    var rehydrated = Object.assign({}, val, {
      cards: val.cards.map(getCardForId),
    });
    return rehydrated;
  }

  function getCardForId(id: string) {
    return thingPersister.get(id);
  }
}

export function DehydratePile() {
  return dehydratePile;

  function dehydratePile(val): Pile {
    if (val === null || !val.cards) {
      return val;
    }

    if (val.cards.length > 0 && typeof val.cards[0] === 'string') {
      throw new Error(
        'dehydratePile called on possibly already-dehydrated pile.'
      );
    }

    // TODO: Maybe deep copy?
    var dehydrated = Object.assign({}, val, {
      cards: val.cards.map((card) => card.id),
    });
    return dehydrated;
  }
}
