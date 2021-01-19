<script lang="ts">
import CardComp from './Card.svelte';
import type { PileStoreType } from '../stores/pile-store';
import type { CardStoreType } from '../stores/card-store';
import type { Card } from '../things/card';

export let cardStore: CardStoreType;
export let pileStore: PileStoreType;
export let showDeleteButton = true;
export let compact = false;

function deleteCard() {
  cardStore.delete();
}

function toggleCompact() {
  compact = !compact;
}

function removeFromPile(card: Card) {
  pileStore.removeCard(card);
}

</script>
<div class="card-actions-container">
  <CardComp cardStore={cardStore} bind:compact={compact} />
  <div class="actions">
    {#if showDeleteButton}
      <button class="delete-button" on:click={deleteCard}>Delete</button>
    {/if}

    <button on:click={toggleCompact}>{#if compact}Show more{:else}Show less{/if}</button>

    {#if pileStore}
      <button on:click={() => removeFromPile($cardStore)}>Remove from this pile</button>
    {/if}
  </div>
</div>
