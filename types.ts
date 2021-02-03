import type { Writable } from 'svelte/store';

export interface Thing {
  id: string;
  text?: string;
  title?: string;
  secretText?: string;
  picture?: string;
  tags: string[];
  color?: string;
}

export interface Card extends Omit<Thing, 'text'> {
  text: string;
  // TODO: History
}

export interface Pile extends Omit<Thing, 'title'> {
  title: string;
  cards: Card[];
}

export interface ThingStore<ThingType> extends Writable<ThingType> {
  delete: () => void;
}

export interface CardStoreType extends ThingStore<Card> {
  delete: () => void;
}

export type StoreCtor<T, StoreT extends ThingStore<T>> = (object, T) => StoreT;

export interface StoreIssuerType<T, StoreT> {
  getStore: (T) => StoreT;
  getStoreForId: (string) => StoreT;
  removeWithId: (string) => void;
}

export interface PileStoreType extends ThingStore<Pile> {
  delete: () => void;
  addCard: (card: Card) => void;
  removeCard: (card: Card) => void;
}

export type StateOptParams = { initCards?: Card[]; initPiles? };

export interface ThingConflictPair {
  id: string; // Only needs to be unique to the import.
  incumbent: Thing;
  challenger: Thing;
}
