// Singleton for persisting stores.

import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import type { Thing } from '../things/thing';
import type { Card } from '../things/card';
import type { Pile } from '../things/pile';
import pluck from 'lodash.pluck';
import compact from 'lodash.compact';
import curry from 'lodash.curry';

const idListPrefix = 'ids';

type StateOptParams = { initCards?: Card[]; initPiles? };

export default function State(profileId: string, opts?: StateOptParams) { 
  const cardIdsKeyForProfile = `${profileId}__${idListPrefix}__cards`;
  const pileIdsKeyForProfile = `${profileId}__${idListPrefix}__piles`;

  var cards: Card[] = loadThings(cardIdsKeyForProfile, opts ? opts.initCards : null);
  var piles: Pile[] = loadThings(pileIdsKeyForProfile, opts ? opts.initPiles : null);

  var allCardsStore = writable(cards);
  var allPilesStore = writable(piles);

  return {
    allCardsStore,
    allPilesStore,
    deleteCard: curry(deleteThing)(allCardsStore, cards, cardIdsKeyForProfile),
    deletePile: curry(deleteThing)(allPilesStore, piles, pileIdsKeyForProfile),
    createCard,
    createPile,
    persistThing,
    updateAllCards: curry(saveIdsToLocalStorage)(cardIdsKeyForProfile),
    updateAllPiles: curry(saveIdsToLocalStorage)(pileIdsKeyForProfile),
    addCard: curry(addThing)(allCardsStore, cards, cardIdsKeyForProfile),
    addPile: curry(addThing)(allPilesStore, piles, pileIdsKeyForProfile)
  };

  function persistThing(thing: Thing) {
    // Someday: Custom serializers?
    localStorage.setItem(thing.id, JSON.stringify(thing));
  }
  // TODO: Pile versions of these. That do make
  // additional transformations.

  function deleteThing(allThingsStore, things: Thing[], idsKeyForProfile: string, id: string) {
    //console.log(allCardsStore, thingStore);
    const index = things.findIndex(c => c.id === id);
    if (index < 0) {
      console.error(new Error('del cannot find ' + id));
      return;
    }
    things.splice(index, 1);

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
    addThing(allCardsStore, cards, cardIdsKeyForProfile, card);

    return card;
  }

  function addThing(allThingsStore, things: Thing[],  idsKeyForProfile: string, thing: Thing) {
    things.push(thing);
    persistThing(thing);
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
    addThing(allPilesStore, piles, pileIdsKeyForProfile, pile);

    return pile;
  }

  function saveIdsToLocalStorage(idsKeyForProfile, things: Thing[]) {
    localStorage.setItem(idsKeyForProfile, pluck(things, 'id').join(','));
  }

  function loadThings<T>(idsKeyForProfile: string, initThings: T[]): T[] {
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
    return things;
  }
}

// TODO: Validate?
function getThingFromLocalStorage(id: string) {
  // TODO: Safe parse
  return JSON.parse(localStorage.getItem(id));
}
