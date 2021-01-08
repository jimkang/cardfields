export interface Card {
  id: string;
  text: string;
  title?: string;
  secretText?: string;
  picture?: string;
  tags: string[];
  color?: string;
  // TODO: History
}

export function getCardKey(card: Card): string {
  return getCardKeyFromId(card.id);
}

export function getCardKeyFromId(id: string): string {
  return 'card__' + id;
}
