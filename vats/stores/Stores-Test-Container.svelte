<script lang="ts">
// @ts-check
import CardComp from '../../components/Card.svelte';
import type { Card } from '../../types';

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
</script>

<main>
  <h1>Stores experiment</h1>
  <CardComp card={card} />
</main>
