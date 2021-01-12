<script lang="ts">
import { onMount } from 'svelte';

export let cardStore;
export let allowEditing = true;
export let compact = false;

let rootEl;

onMount(updateEditables);

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

<div class="card {compact ? 'compact' : ''}" id={$cardStore.id} style="background-color: {$cardStore.color}" bind:this={rootEl}>
  <h4 contenteditable="true" bind:innerHTML={$cardStore.title} class="title"></h4>

  <img src="{$cardStore.picture}" alt="Card illustration">

  <div class="group">
    {#if !compact }
      <h4 class="label">Description</h4>
    {/if}
    <div class="text" contenteditable="true" bind:innerHTML={$cardStore.text}></div>
  </div>

  {#if !compact }
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
  {/if}
</div>
