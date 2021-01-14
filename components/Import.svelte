<script lang="ts">
import type { CardConflictPair } from '../things/card';
import pluck from 'lodash.pluck';
import curry from 'lodash.curry';
import ErrorMessage from 'svelte-error-message';
import { removeCardFromList } from '../things/card';
import ImportConflictFrame from './ImportConflictFrame.svelte';

export let allCardsStore;
export let state;

let applyToAllDecisionMade = false;
let conflictPairs: CardConflictPair[] = [];
let error;
let cardsImportedCount = 0;

$: conflictPairs;

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
  cards.forEach(curry(importIfSafe)(existingIds));
}

function importIfSafe(existingIds: string[], card: Card, index: number) {
  if (existingIds.includes(card.id)) {
    let incumbent = $allCardsStore[existingIds.indexOf(card.id)];
    conflictPairs.push({ id: index, incumbent, challenger: card });
    conflictPairs = conflictPairs;
    return;
  }

  state.addCard(card);
  cardsImportedCount += 1;
}

function onConflictResolved(e) {
  const pairIndex = e.detail;
  conflictPairs.splice(pairIndex, 1);
  conflictPairs = conflictPairs;
}

</script>

<div class="import-zone">
  <h3>Import cards</h3>
  <input type="file" id="import-file" accept="text/*, application/json" on:change={onFileChange} />

  <ErrorMessage error={error} />

  <h4>Cards imported</h4>
  <div>{cardsImportedCount}</div>

  {#if !applyToAllDecisionMade && conflictPairs.length > 0}
    <h4>We need you to tell us what to do with these cards from your file.</h4>
    <ul>
    {#each conflictPairs as conflictPair}
      <ImportConflictFrame state={state} conflictPair={conflictPair} on:conflictResolved={onConflictResolved} />
    {/each}
    </ul>
  {/if}
</div>
