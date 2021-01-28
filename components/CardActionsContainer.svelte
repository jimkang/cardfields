<script lang="ts">
import CardComp from './Card.svelte';
import type { PileStoreType } from '../stores/pile-store';
import type { CardStoreType } from '../stores/card-store';
import type { Card } from '../things/card';
import type { Pile } from '../things/pile';
import type { StoreIssuerType } from '../stores/store-issuer';
import curry from 'lodash.curry';
import pluck from 'lodash.pluck';

export let cardStore: CardStoreType;
export let pileStore: PileStoreType = null;
export let allPilesStore;
export let pileStoreIssuer: StoreIssuerType<Pile, PileStoreType>;

export let showDeleteButton = true;
export let compact = false;

let pilesCardIsNotIn: Pile[];
$: pilesCardIsNotIn = getPilesCardIsNotIn($pileStore, $allPilesStore);

function deleteCard() {
  pilesCardIsNotIn.map(pileStoreIssuer.getStore).forEach(ps => ps.removeCard($cardStore));
  cardStore.delete();
}

function toggleCompact() {
  compact = !compact;
}

function removeFromPile(card: Card) {
  pileStore.removeCard(card);
}

function moveCardToPile(card: Card, pile: Pile) {
  removeFromPile(card);
  var pileStore: PileStoreType = pileStoreIssuer.getStore(pile);
  pileStore.addCard(card);
}

function getPilesCardIsNotIn(currentPile: Pile, allPiles: Pile[]): Pile[] {
  if (!pileStore) {
    return allPiles;
  }
  return allPiles.filter(pile => pile.id !== currentPile.id);
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

    {#if pilesCardIsNotIn.length > 0 }
      <h4>Move to this pile</h4>
      {#each pilesCardIsNotIn as pile}
        <button on:click={() => moveCardToPile($cardStore, pile)}>{pile.title || pile.id}</button>
      {/each}
    {/if}

  </div>
</div>
