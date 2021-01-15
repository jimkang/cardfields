// Singleton for persisting stores.

import { writable } from 'svelte/store';
import { v4 as uuid } from 'uuid';
import type { Card } from '../things/card';
import type { Pile } from '../things/pile';
import pluck from 'lodash.pluck';
import compact from 'lodash.compact';

const idListPrefix = 'ids';

type StateOptParams = { initCards?: Card[]; initPiles? };

export default function State(profileId: string, opts?: StateOptParams) { 
  const cardIdsKeyForProfile = `${profileId}__${idListPrefix}__cards`;
  const pileIdsKeyForProfile = `${profileId}__${idListPrefix}__piles`;

  var cards: Card[] = loadThings(cardIdsKeyForProfile, opts ? opts.initCards : null);
  var piles: Pile[] = loadThings(pileIdsKeyForProfile, opts ? opts.initPiles : null);

  var allCardsStore = writable(cards);

  return {
    allCardsStore,
    deleteCard,
    createCard,
    persistCard,
    updateAllCards: saveIdsToLocalStorage,
    addCard
  };

  function persistCard(card: Card) {
    localStorage.setItem(card.id, JSON.stringify(card));
  }

  function deleteCard(id: string) {
    //console.log(allCardsStore, cardStore);
    const index = cards.findIndex(c => c.id === id);
    if (index < 0) {
      console.error(new Error('del cannot find ' + id));
      return;
    }
    cards.splice(index, 1);

    saveIdsToLocalStorage(cards);
    localStorage.removeItem(id);
    allCardsStore.set(cards);
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

  function addCard(card: Card) {
    cards.push(card);
    persistCard(card);
    saveIdsToLocalStorage(cards);
    allCardsStore.set(cards);
  }

  function saveIdsToLocalStorage(cards: Card[]) {
    localStorage.setItem(cardIdsKeyForProfile, pluck(cards, 'id').join(','));
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
