<script lang="ts">
import type { Card, CardConflictPair } from '../things/card';
import CardComp from './Card.svelte';
import CardStore from '../stores/card-store';
import { createEventDispatcher } from 'svelte';

export let conflictPair: CardConflictPair;
export let state;

var dispatch = createEventDispatcher();

// TODO: Get store from idempotent thing.
var incumbentStore = CardStore(state, conflictPair.incumbent);

function takeIncumbent() {
  dispatch('conflictResolved', conflictPair.id);
}

function takeChallenger() {
  incumbentStore.set(conflictPair.challenger);
  dispatch('conflictResolved', conflictPair.id);
}

</script>

<li class="conflict-frame">
  <CardComp cardStore={CardStore(state, conflictPair.incumbent)} allowEditing={false} />
  <CardComp cardStore={CardStore(state, conflictPair.challenger)} allowEditing={false} />
  <button on:click={takeIncumbent}>Leaving existing card</button>
  <button on:click={takeChallenger}>Replace existing card with this version</button>
</li>
