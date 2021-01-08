import CardComp from '../../components/Card.svelte';
import CardStore from '../../stores/card-store';
import type { Card } from '../../things/card';

var card: Card = {
  id: 'unique-card',
  text: 'Clean inbox all the way!',
  secretText: 'Delete incriminating evidence!',
  //picture: 'https://smidgeo.com/images/smidgeo_headshot.jpg',
  picture:
    'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
  tags: ['email', 'maintenance', 'chore'],
  color: 'hsl(0, 50%, 50%)'
};

var cardComp = new CardComp({
  target: document.getElementById('temp'),
  props: { cardStore: CardStore(card) }
});

export default cardComp;
