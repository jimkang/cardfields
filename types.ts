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
}

export interface Card extends Omit<UIThing, 'text'> {
  text: string;
  // TODO: History
}

export interface Pile extends Omit<UIThing, 'title'> {
  title: string;
  cards: Card[];
}

export interface Profile extends UIThing {
  piles: Pile[];
}

export type StateOptParams = { initCards?: Card[]; initPiles? };

export interface ThingConflictPair {
  id: string; // Only needs to be unique to the import.
  incumbent: Thing;
  challenger: Thing;
}

export interface Persister {
  write(Thing);
  get(string): Thing;
  delete(Thing);
}
