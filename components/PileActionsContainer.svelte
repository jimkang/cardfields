<script lang="ts">
import PileComp from './Pile.svelte';

export let pileStore;
export let cardStoreIssuer;
export let showDeleteButton = true;
export let compact = false;

function deletePile() {
  pileStore.delete();
}

function toggleCompact() {
  compact = !compact;
}

// TODO: Refactor the action containers

</script>
<div class="pile-actions-container">
  <PileComp pileStore={pileStore} cardStoreIssuer={cardStoreIssuer} bind:compact={compact} />
  <div class="actions">
    {#if showDeleteButton}
      <button class="delete-button" on:click={deletePile}>Delete</button>
    {/if}
    <button on:click={toggleCompact}>{#if compact}Show more{:else}Show less{/if}</button>
  </div>
</div>
