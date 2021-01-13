<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import CardComp from '../../components/Card.svelte';
import ExportComp from '../../components/Export.svelte';
import ImportComp from '../../components/Import.svelte';
import State from '../../stores/state';
import CardStore from '../../stores/card-store';
import curry from 'lodash.curry';

var state = State();
var allCardsStore = state.allCardsStore;

</script>

<main>
  <h1>Stores experiment</h1>
  {#each $allCardsStore.map(curry(CardStore)(state)) as cardStore}
    <CardActionsContainer cardStore={cardStore} state={state} />
  {/each}

  <button on:click={state.createCard}>Add new card</button>

  <ExportComp allCardsStore={allCardsStore} />
  <ImportComp allCardsStore={allCardsStore} state={state} />
</main>
