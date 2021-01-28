<script lang="ts">
import type { ThingConflictPair, Thing } from '../things/thing';
import type { Card } from '../things/card';
import type { Pile } from '../things/pile';
import type { StoreIssuerType } from '../stores/store-issuer';
import type { ThingStore } from './../stores/store-types';

import CardComp from './Card.svelte';
import PileComp from './Pile.svelte';
import CardStore from '../stores/card-store';
import PileStore from '../stores/pile-store';
import { createEventDispatcher } from 'svelte';
import curry from 'lodash.curry';

export let thingTypeName: string;
export let conflictPair: ThingConflictPair;
export let cardStoreIssuer: StoreIssuerType<Card, ThingStore<Card>>;
export let pileStoreIssuer: StoreIssuerType<Pile, ThingStore<Pile>>;
export let state;
let allPilesStore = state.allPilesStore;

var dispatch = createEventDispatcher();

// The $ here makes sure the CardComps are rerendered
// when conflictPair changes.
$: conflictPair;

function takeIncumbent() {
  dispatch('conflictResolved', conflictPair.id);
}

function takeChallenger(storeIssuer: StoreIssuerType<Thing, ThingStore<Thing>>) {
  var store: ThingStore<Thing> = storeIssuer
    .getStore(conflictPair.incumbent);
  store.set(conflictPair.challenger);
  dispatch('conflictResolved', conflictPair.id);
}

</script>

<li class="conflict-frame">
  {#if thingTypeName === 'card'}

    <CardComp cardStore={cardStoreIssuer.getStore(conflictPair.incumbent)} allowEditing={false} />
    <CardComp cardStore={CardStore(state, conflictPair.challenger)} allowEditing={false} />
    <button on:click={curry(takeIncumbent)(cardStoreIssuer)}>Leaving existing card</button>
    <button on:click={curry(takeChallenger)(cardStoreIssuer)}>Replace existing card with this version</button>

  {:else if thingTypeName === 'pile'}

    <PileComp pileStore={pileStoreIssuer.getStore(conflictPair.incumbent)} {allPilesStore} {cardStoreIssuer} {pileStoreIssuer} allowEditing={false} />
    <PileComp pileStore={PileStore(state, conflictPair.challenger)} {allPilesStore} {cardStoreIssuer} {pileStoreIssuer} allowEditing={false} />
    <button on:click={curry(takeIncumbent)(pileStoreIssuer)}>Leaving existing pile</button>
    <button on:click={curry(takeChallenger)(pileStoreIssuer)}>Replace existing pile with this version</button>

  {/if}

</li>
