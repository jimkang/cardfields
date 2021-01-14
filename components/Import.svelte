<script lang="ts">
import type { CardConflictPair } from '../things/card';
import pluck from 'lodash.pluck';
import curry from 'lodash.curry';
import ErrorMessage from 'svelte-error-message';
import { removeCardFromList } from '../things/card';
import ImportConflictFrame from './ImportConflictFrame.svelte';

export let allCardsStore;
export let cardStoreIssuer;
export let state;

let applyToAllDecisionMade = false;
let conflictPairs: CardConflictPair[] = [];
let error;
let cardsImportedCount = 0;

$: conflictPairs;

function onFileChange() {
  var file = this.files[0];
  if (file && (file.type.startsWith('text/') || file.type === 'application/json')) {
    file.text().then(importCardsString).catch(e => error = e);
  }
}

function importCardsString(cardsString: string) {
  cardsImportedCount = 0;
  // TODO: Safe parse
  var cards: Card[] = JSON.parse(cardsString);
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
  const pairId = e.detail;
  const pairIndex = conflictPairs.findIndex(p => p.id === pairId);
  if (pairIndex < 0) {
    error = new Error(`Cannot find conflictPair ${pairId} while resolving conflict.`);
    return;
  }

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
      <ImportConflictFrame cardStoreIssuer={cardStoreIssuer} state={state} conflictPair={conflictPair} on:conflictResolved={onConflictResolved} />
    {/each}
    </ul>
  {/if}
</div>
