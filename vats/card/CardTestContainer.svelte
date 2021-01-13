<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import State from '../../stores/state';
import CardStore from '../../stores/card-store';
import type { Card } from '../../things/card';

var state = State();

var card: Card = {
  id: 'unique-card',
  text: 'Clean inbox all the way!',
  title: 'Clean',
  secretText: 'Delete incriminating evidence!',
  //picture: 'https://smidgeo.com/images/smidgeo_headshot.jpg',
  picture:
    'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
  tags: ['email', 'maintenance', 'chore'],
  color: 'hsl(0, 50%, 50%)'
};

var cardStore = CardStore(state, card);
</script>

<main>
  <h1>Card test vat</h1>
  <CardActionsContainer cardStore={cardStore} state={state} />
</main>
