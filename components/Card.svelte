<script lang="ts">
import { onMount } from 'svelte';

export let cardStore;
export let state;
export let showDeleteButton = true;
export let allowEditing = true;

let rootEl;

onMount(updateEditables);

function deleteCard() {
  //console.log(allCardsStore, cardStore);
  // $cardStore refers to the value (the Card)
  // and cardStore refers to the store.
  state.deleteCard($cardStore.id);
}

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

</script>

<div class="card" id={$cardStore.id} style="background-color: {$cardStore.color}" bind:this={rootEl}>
  <h2 contenteditable="true" bind:innerHTML={$cardStore.title}></h2>

  <img src="{$cardStore.picture}" alt="Card illustration">

  <div class="group">
    <h4 class="label">Description</h4>
    <div class="text" contenteditable="true" bind:innerHTML={$cardStore.text}></div>
  </div>

  <div class="group">
    <h4 class="label">Secret description</h4>
    <div class="secret text" contenteditable="true" bind:innerHTML={$cardStore.secretText}></div>
  </div>

  <div class="group">
    <h4 class="label">Tags</h4>
    <div class="tags" contenteditable="true">
    {#each $cardStore.tags as tag}
      <span class="tag">{tag}</span>
    {/each}
    </div>
  </div>

  <div class="actions">
    {#if showDeleteButton}
      <button class="delete-button" on:click={deleteCard}>Delete</button>
    {/if}
  </div>
 </div>
