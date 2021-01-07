<script lang="ts">
export let card;
</script>

<div class="card" style="background-color: {card.color}">
  <h2 contenteditable>{card.title || card.text}</h2>

  <img src="{card.picture}" alt="Card illustration">

  <div class="group">
    <h4 class="label">Description</h4>
    <div class="text" contenteditable>{card.text}</div>
  </div>

  <div class="group">
    <h4 class="label">Secret description</h4>
    <div class="secret text" contenteditable>{card.secretText}</div>
  </div>

  <div class="group">
    <h4 class="label">Tags</h4>
    <div class="tags" contenteditable>
    {#each card.tags as tag}
      <span class="tag">{tag}</span>
    {/each}
    </div>
  </div>
 </div>
