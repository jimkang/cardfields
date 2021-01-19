<script lang="ts">
import { onMount } from 'svelte';
import CardActionsContainer from './CardActionsContainer.svelte';
import type { Card } from '../things/card';
import type { StoreIssuerType } from '../stores/store-issuer';
import type { CardStoreType } from '../stores/card-store';

export let pileStore;
export let cardStoreIssuer: StoreIssuerType<Card, CardStoreType>;
export let allowEditing = true;
export let compact = false;

let rootEl;

onMount(updateEditables);
// TODO: Factor out of this and Card comp.

function updateEditables() {
  if (allowEditing) {
    // They're set to true by default; nothing to
    // do here.
    return;
  }

  var editables = rootEl.querySelectorAll(`[contenteditable]`);
  for (var i = 0; i < editables.length; ++i) {
    editables[i].setAttribute('contenteditable', 'false');
  }
}

function getCardStores(cards: Card[]): CardStoreType[] {
  return cards.map(cardStoreIssuer.getStore);
}

</script>

<div class="pile {compact ? 'compact' : ''}" id={$pileStore.id} style="background-color: {$pileStore.color}" bind:this={rootEl}>
  <h4 contenteditable="true" bind:innerHTML={$pileStore.title} class="title"></h4>

  <div class="group">
    {#if !compact }
      <h4 class="label">Description</h4>
    {/if}
    <div class="text" contenteditable="true" bind:innerHTML={$pileStore.text}></div>
  </div>

  {#if !compact }
    <div class="group">
      <h4 class="label">Secret description</h4>
      <div class="secret text" contenteditable="true" bind:innerHTML={$pileStore.secretText}></div>
    </div>

    <div class="group">
      <h4 class="label">Tags</h4>
      <div class="tags" contenteditable="true">
      {#each $pileStore.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
      </div>
    </div>
  {/if}

  {#each getCardStores($pileStore.cards) as cardStore}
    <CardActionsContainer cardStore={cardStore} pileStore={pileStore} />
  {/each}
</div>
