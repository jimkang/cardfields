<script lang="ts">
import PileComp from './Pile.svelte';
import type { Card } from '../things/card';
import type { Pile } from '../things/pile';
import type { PileStoreType } from '../stores/pile-store';
import type { StoreIssuerType } from '../stores/store-issuer';

export let state;
export let pileStore;
export let cardStoreIssuer;
export let showDeleteButton = true;
export let compact = false;
export let allPilesStore;
export let pileStoreIssuer: StoreIssuerType<Pile, PileStoreType>;

function deletePile() {
  pileStore.delete();
}

function toggleCompact() {
  compact = !compact;
}

function createCard() {
  var card: Card = state.createCard();
  pileStore.addCard(card);
}

// TODO: Refactor the action containers

</script>
<div class="pile-actions-container">
  <PileComp {pileStore} {cardStoreIssuer} {pileStoreIssuer} bind:compact={compact} {allPilesStore} />
  <div class="actions">
    {#if showDeleteButton}
      <button class="delete-button" on:click={deletePile}>Delete</button>
    {/if}
    <button on:click={toggleCompact}>{#if compact}Show more{:else}Show less{/if}</button>
    <button on:click={createCard}>New card</button>
  </div>
</div>
