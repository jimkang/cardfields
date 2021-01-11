<script lang="ts">
// @ts-check
import CardComp from '../../components/Card.svelte';
import ExportComp from '../../components/Export.svelte';
import State from '../../stores/state';
import CardStore from '../../stores/card-store';

var state = State();
var allCardsStore = state.allCardsStore;

</script>

<main>
  <h1>Stores experiment</h1>
  {#each $allCardsStore as card}
    <CardComp cardStore={CardStore(state, card)} state={state} />
  {/each}

  <button on:click={state.createCard}>Add new card</button>

  <ExportComp allCardsStore={allCardsStore} />

  <button on:click={state.createCard}>Import cards</button>
</main>
