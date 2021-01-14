<script lang="ts">
import CardComp from './Card.svelte';

export let cardStore;
export let showDeleteButton = true;
export let compact = false;

function deleteCard() {
  cardStore.delete();
}

function toggleCompact() {
  compact = !compact;
}

</script>
<div class="card-actions-container">
  <CardComp cardStore={cardStore} bind:compact={compact} />
  <div class="actions">
    {#if showDeleteButton}
      <button class="delete-button" on:click={deleteCard}>Delete</button>
    {/if}
    <button on:click={toggleCompact}>{#if compact}Show more{:else}Show less{/if}</button>
  </div>
</div>
