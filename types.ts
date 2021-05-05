export interface Thing {
  id: string;
}

export interface UIThing extends Thing {
  text?: string;
  title?: string;
  secretText?: string;
  picture?: string;
  tags?: string[];
  color?: string;
  visible: boolean;
}

export interface Card extends Omit<UIThing, 'text'> {
  text: string;
  // TODO: History
}

export interface Plane extends Omit<UIThing, 'title'> {
  title: string;
  cardPts: CardPt[];
}

export type CardPt = { cardId: string; pt: Pt }
export type Pt = [number, number, number];

export interface Pile extends Omit<UIThing, 'title'> {
  title: string;
  cards: Card[];
}

export interface Deck extends UIThing {
  piles: Pile[];
}

export type StateOptParams = { initCards?: Card[]; initPiles? };

export interface ThingConflictPair {
  id: string; // Only needs to be unique to the import.
  incumbent: Thing;
  challenger: Thing;
}

export interface Persister {
  write(any);
  get(string);
  delete(any);
}

export interface StoreType<T> {
  get();
  getRaw(): unknown;
  set(T): void;
  setRaw(unknown): void;
  setValue(unknown): void;
  setPart(T): void;
  subscribe: (Store) => void;
  unsubscribe: (Store) => void;
  del(): void;
  isDeleted: () => boolean;
}

export interface CollectionStoreType extends StoreType<Thing[]> {
  add(Thing): void;
  remove(Thing): void;
  kind: string;
  parentThingId: string;
}
