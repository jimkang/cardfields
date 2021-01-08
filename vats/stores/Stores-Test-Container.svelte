<script lang="ts">
// @ts-check
import CardComp from '../../components/Card.svelte';
import CardStore from '../../stores/card-store';
import AllCardsStore from '../../stores/all-cards-store';

var allCardsStore = AllCardsStore();

/*
allCardsStore.add(
  {
    id: 'unique-card',
    text: 'Clean inbox all the way!',
    secretText: 'Delete incriminating evidence!',
    picture: 'https://smidgeo.com/images/smidgeo_headshot.jpg',
    //picture:
    //  'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
    tags: ['email', 'maintenance', 'chore'],
    color: 'hsl(0, 50%, 50%)'
  }
);
allCardsStore.add(
  {
    id: 'unique-card-2',
    text: 'Another card!',
    secretText: 'Eat a pie',
    picture:
      'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
    tags: ['eat', 'pie'],
    color: 'hsl(70, 50%, 50%)'
  }
);

allCardsStore.add({
  id: 'unique-card-3',
  text: 'Cast a spell',
  secretText: 'Magic Missile',
  picture:
    'https://smidgeo.com/notes/deathmtn/media/54F917E8-D61B-4D7D-8537-7073D2E53713.jpeg',
  tags: ['magic'],
  color: 'hsl(210, 50%, 50%)'
});
*/

</script>

<main>
  <h1>Stores experiment</h1>
  {#each $allCardsStore as card}
    <CardComp cardStore={CardStore(card)} allCardsStore={allCardsStore} />
  {/each}
</main>
