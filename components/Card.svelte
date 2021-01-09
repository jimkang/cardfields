<script lang="ts">
export let cardStore;
export let state;

function deleteCard() {
  //console.log(allCardsStore, cardStore);
  // $cardStore refers to the value (the Card)
  // and cardStore refers to the store.
  state.deleteCard($cardStore.id);
}
</script>

<div class="card" style="background-color: {$cardStore.color}">
  <h2 contenteditable bind:innerHTML={$cardStore.title}></h2>

  <img src="{$cardStore.picture}" alt="Card illustration">

  <div class="group">
    <h4 class="label">Description</h4>
    <div class="text" contenteditable bind:innerHTML={$cardStore.text}></div>
  </div>

  <div class="group">
    <h4 class="label">Secret description</h4>
    <div class="secret text" contenteditable bind:innerHTML={$cardStore.secretText}></div>
  </div>

  <div class="group">
    <h4 class="label">Tags</h4>
    <div class="tags" contenteditable>
    {#each $cardStore.tags as tag}
      <span class="tag">{tag}</span>
    {/each}
    </div>
  </div>

  <div class="actions">
    <button class="delete-button" on:click={deleteCard}>Delete</button>
  </div>
 </div>
