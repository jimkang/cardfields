<script lang="ts">
import type { ThingConflictPair } from '../things/thing';
import type { StoreIssuerType } from '../stores/store-issuer';
import type { CardStoreType } from '../stores/card-store';
import type { PileStoreType } from '../stores/pile-store';
import ImportConflictFrame from './ImportConflictFrame.svelte';
import ErrorMessage from 'svelte-error-message';

export let conflictPairs: ThingConflictPair[];
export let thingTypeName: string;
export let cardStoreIssuer: StoreIssuerType<Card, CardStoreType>;
export let pileStoreIssuer: StoreIssuerType<Pile, PileStoreType>;
export let state;

let error;
$: conflictPairs;

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
  <ErrorMessage {error} />

  {#if conflictPairs.length > 0}
    <h4>We need you to tell us what to do with these {thingTypeName}s from your file.</h4>
    <ul>
    {#each conflictPairs as conflictPair}
      <ImportConflictFrame {thingTypeName} {cardStoreIssuer} {pileStoreIssuer} {state} {conflictPair} on:conflictResolved={onConflictResolved} />
    {/each}
    </ul>
  {/if}
