<script lang="ts">
import { importThings } from '../tasks/import';
import type { ThingConflictPair } from '../things/thing';
import pluck from 'lodash.pluck';
import curry from 'lodash.curry';
import ErrorMessage from 'svelte-error-message';
import { removeCardFromList } from '../things/card';
import ImportConflictFrame from './ImportConflictFrame.svelte';
import { rehydratePile } from '../things/pile';

export let allCardsStore;
export let cardStoreIssuer;
export let state;

let applyToAllDecisionMade = false;
let conflictPairs: ThingConflictPair[] = [];
let error;
let cardsImportedCount = 0;

$: conflictPairs;

function onFileChange() {
  var file = this.files[0];
  if (file && (file.type.startsWith('text/') || file.type === 'application/json')) {
    file.text().then(importString).catch(e => error = e);
  }
}

function importString(s: string) {
  cardsImportedCount = 0;
  // TODO: Safe parse
  var importObj = JSON.parse(s);
  var cards: Card[] = importObj.cards;
  var piles: Pile[];
  if (importObj.piles) {
    importObj.piles.map(curry(rehydratePile)($allCardsStore));
  }
  if (cards) {
    cardsImportedCount = importThings<Card>(cards, $allCardsStore, conflictPairs, state.addCard);
    conflictPairs = conflictPairs;
  } else {
    error = new Error('Could not find cards to import.');
  }
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
