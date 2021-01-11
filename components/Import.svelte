<script lang="ts">
import type { Card } from '../things/card';
import pluck from 'lodash.pluck';
import curry from 'lodash.curry';

import ErrorMessage from 'svelte-error-message';

export let allCardsStore;
export let state;

let applyToAllDecisionMade = false;
let conflictCards: Card[] = [];
let error;
let cardsImportedCount = 0;

$: conflictCards;

function onFileChange() {
  var file = this.files[0];
  console.log(file.type);
  if (file && (file.type.startsWith('text/') || file.type === 'application/json')) {
    file.text().then(importCardsString).catch(e => error = e);
  }
}

function importCardsString(cardsString: string) {
  // TODO: Safe parse
  var cards: Card[] = JSON.parse(cardsString);
  console.log('cards', cards);
  var importIds: string = pluck(cards, 'id');
  var existingIds: string = pluck($allCardsStore, 'id');
  $allCardsStore.forEach(curry(importIfSafe)(existingIds));
}

function importIfSafe(existingIds: string[], card: Card) {
  debugger
  if (existingIds.includes(card.id)) {
    conflictCards.push(card);
    conflictCards = conflictCards;
    console.log('conflictCards', conflictCards);
    return;
  }

  state.addCard(card);
  cardsImportedCount += 1;
}

</script>

<div class="import-zone">
  <h3>Import cards</h3>
  <input type="file" id="import-file" accept="text/*, application/json" on:change={onFileChange} />

  <ErrorMessage error={error} />

  <h4>Cards imported</h4>
  <div>{cardsImportedCount}</div>

  {#if !applyToAllDecisionMade && conflictCards.length > 0}
    <h4>We need you to tell us what to do with these cards from your file</h4>
    <ul>
    {#each conflictCards as conflictCard}
      <li>{conflictCard.title} {conflictCard.id}</li>
    {/each}
    </ul>
  {/if}
</div>
