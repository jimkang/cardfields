import type { Persister, View, CardRef } from '../types';

interface DehydratedCardRef {
  card: string;
  homePile: string;
}

export function RehydrateView(thingPersister: Persister) {
  return rehydrateView;

  // These functions should not mess with val.
  function rehydrateView(val): View {
    if (val === null || !val.cardRefs) {
      return val;
    }

    if (val.cardRefs.length > 0 && typeof val.cardRefs[0] === 'object') {
      throw new Error(
        'rehydrateView called on possibly already-rehydrated view.'
      );
    }

    var rehydrated = Object.assign({}, val, {
      cardRefs: val.cardRefs.map(rehydrateCardRef),
    });
    return rehydrated;
  }

  function rehydrateCardRef({ card, homePile }: DehydratedCardRef): CardRef {
    return {
      card: thingPersister.get(card),
      homePile: thingPersister.get(homePile),
    };
  }
}

export function DehydrateView() {
  return dehydrateView;

  function dehydrateView(val): View {
    if (val === null || !val.cardRefs) {
      return val;
    }

    if (val.cardRefs.length > 0 && typeof val.cardRefs[0] === 'string') {
      throw new Error(
        'dehydrateView called on possibly already-dehydrated view.'
      );
    }

    var dehydrated = Object.assign({}, val, {
      cardRefs: val.cardRefs.map(dehydrateCardRef),
    });
    return dehydrated;
  }

  function dehydrateCardRef(cardRef: CardRef): DehydratedCardRef {
    return { card: cardRef.card.id, homePile: cardRef.homePile.id };
  }
}
