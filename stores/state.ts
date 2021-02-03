// Singleton for persisting stores.

import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import type { Thing, Card, Pile, StateOptParams } from '../types';
import { removeFromArrayById } from '../things/thing';
import { rehydratePile, dehydratePile } from '../things/pile';
import pluck from 'lodash.pluck';
import compact from 'lodash.compact';
import curry from 'lodash.curry';

const idListPrefix = 'ids';

export default function State(profileId: string, opts?: StateOptParams) { 
  const cardIdsKeyForProfile = `${profileId}__${idListPrefix}__cards`;
  const pileIdsKeyForProfile = `${profileId}__${idListPrefix}__piles`;

  var cards: Card[] = loadThings(cardIdsKeyForProfile, opts ? opts.initCards : null);
  var piles: Pile[] = loadThings(pileIdsKeyForProfile, opts ? opts.initPiles : null, curry(rehydratePile)(cards));

  var allCardsStore = writable(cards);
  var allPilesStore = writable(piles);
  var addCard = curry(add)(allCardsStore, cards, persistThing, cardIdsKeyForProfile);
  var addPile = curry(add)(allPilesStore, piles, persistPile, pileIdsKeyForProfile);

  return {
    allCardsStore,
    allPilesStore,
    deleteCard: curry(deleteThing)(allCardsStore, cards, cardIdsKeyForProfile),
    deletePile: curry(deleteThing)(allPilesStore, piles, pileIdsKeyForProfile),
    createCard,
    createPile,
    persistThing,
    persistPile,
    updateAllCards: curry(saveIdsToLocalStorage)(cardIdsKeyForProfile),
    updateAllPiles: curry(saveIdsToLocalStorage)(pileIdsKeyForProfile),
    addCard,
    addPile
  };

  function persistThing(thing: Thing) {
    localStorage.setItem(thing.id, JSON.stringify(thing));
  }

  function persistPile(pile: Pile) {
    localStorage.setItem(pile.id, JSON.stringify(dehydratePile(pile)));
  }

  function deleteThing(allThingsStore, things: Thing[], idsKeyForProfile: string, id: string) {
    //console.log(allCardsStore, thingStore);
    if (!removeFromArrayById(things, id)) {
      console.error(new Error('del cannot find ' + id));
      return;
    }

    saveIdsToLocalStorage(idsKeyForProfile, things);
    localStorage.removeItem(id);
    allThingsStore.set(things);
  }

  function createCard() {
    var card: Card = {
      id: 'card__' + uuid(),
      text: 'Cast a spell',
      secretText: 'Magic Missile',
      picture:
        'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
      tags: ['magic'],
      color: 'hsl(210, 50%, 50%)'
    };
    addCard(card);

    return card;
  }

  function add<T extends Thing>(allThingsStore, things: T[], persistFn: (T) => void, idsKeyForProfile: string, thing: T) {
    things.push(thing);
    persistFn(thing);
    saveIdsToLocalStorage(idsKeyForProfile, things);
    allThingsStore.set(things);
  }

  function createPile() {
    var pile: Pile = {
      id: 'pile__' + uuid(),
      title: 'Spells',
      text: 'Spells pile',
      secretText: 'Magic Missile',
      tags: ['magic'],
      color: 'hsl(210, 50%, 50%)',
      cards: []
    };
    addPile(pile);

    return pile;
  }

  function saveIdsToLocalStorage(idsKeyForProfile, things: Thing[]) {
    localStorage.setItem(idsKeyForProfile, pluck(things, 'id').join(','));
  }

  function loadThings<T extends Thing>(idsKeyForProfile: string, initThings: T[], rehydrateFn: (object) => T = x => x): T[] {
    var things = initThings;
    if (!things) {
      const ids = localStorage.getItem(idsKeyForProfile);
      if (ids && ids.length > 0) {
        things = ids.split(',').map(getThingFromLocalStorage);
      }
    }
    if (!things) {
      things = [];
    }
    things = compact(things);
    return things.map(rehydrateFn);
  }
}

// TODO: Validate?
function getThingFromLocalStorage(id: string) {
  // TODO: Safe parse
  return JSON.parse(localStorage.getItem(id));
}

