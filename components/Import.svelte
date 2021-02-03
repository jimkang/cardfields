<script lang="ts">
import { importThings } from '../tasks/import';
import type { Card, Pile, ThingConflictPair, StoreIssuerType, CardStoreType, PileStoreType } from '../types';
import curry from 'lodash.curry';
// I guess the format for modules changed?
import ErrorMessage from 'svelte-error-message/src/ErrorMessage.svelte';
import { rehydratePile } from '../things/pile';
import ImportConflictSection from './ImportConflictSection.svelte';

export let state;
export let cardStoreIssuer: StoreIssuerType<Card, CardStoreType>;
export let pileStoreIssuer: StoreIssuerType<Pile, PileStoreType>;

let applyToAllDecisionMade = false;
let cardConflictPairs: ThingConflictPair[] = [];
let pileConflictPairs: ThingConflictPair[] = [];
let error;
let cardsImportedCount = 0;
let pilesImportedCount = 0;

$: cardConflictPairs;
$: pileConflictPairs;

let allPilesStore = state.allPilesStore;
let allCardsStore = state.allCardsStore;

function onFileChange() {
  var file = this.files[0];
  if (file && (file.type.startsWith('text/') || file.type === 'application/json')) {
    file.text().then(importString).catch(e => error = e);
  }
}

function importString(s: string) {
  cardsImportedCount = 0;
  pilesImportedCount = 0;
  // TODO: Safe parse
  var importObj = JSON.parse(s);
  var cards: Card[] = importObj.cards;
  var piles: Pile[];
  if (importObj.piles) {
    piles = importObj.piles.map(curry(rehydratePile)($allCardsStore));
  }
  if (cards) {
    cardsImportedCount = importThings<Card>(cards, $allCardsStore, cardConflictPairs, state.addCard);
    cardConflictPairs = cardConflictPairs;
  } else {
    error = new Error('Could not find cards to import.');
  }

  if (piles) {
    pilesImportedCount = importThings<Pile>(piles, $allPilesStore, pileConflictPairs, state.addPile);
    pileConflictPairs = pileConflictPairs;
  }
}

</script>

<div class="import-zone">
  <h3>Import cards</h3>
  <input type="file" id="import-file" accept="text/*, application/json" on:change={onFileChange} />

  <ErrorMessage {error} />

  <h4>Piles imported</h4>
  <div>{pilesImportedCount}</div>
  {#if !applyToAllDecisionMade}
    <ImportConflictSection conflictPairs={pileConflictPairs} thingTypeName="pile" {cardStoreIssuer} {pileStoreIssuer} {state} />
  {/if}

  <h4>Cards imported</h4>
  <div>{cardsImportedCount}</div>
  {#if !applyToAllDecisionMade}
    <ImportConflictSection conflictPairs={cardConflictPairs} thingTypeName="card" {cardStoreIssuer} {pileStoreIssuer} {state} />
  {/if}
</div>
