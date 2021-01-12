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
