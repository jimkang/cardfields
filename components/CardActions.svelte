<script lang="ts">
export let state;
export let cardStore;
export let showDeleteButton = true;

function deleteCard() {
  //console.log(allCardsStore, cardStore);
  // $cardStore refers to the value (the Card)
  // and cardStore refers to the store.
  state.deleteCard($cardStore.id);
}

</script>

<div class="actions">
  {#if showDeleteButton}
    <button class="delete-button" on:click={deleteCard}>Delete</button>
  {/if}
</div>
