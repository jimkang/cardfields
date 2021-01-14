<script lang="ts">
import type { CardConflictPair } from '../things/card';
import CardComp from './Card.svelte';
import CardStore from '../stores/card-store';
import { createEventDispatcher } from 'svelte';

export let conflictPair: CardConflictPair;
export let cardStoreIssuer;
export let state;

var dispatch = createEventDispatcher();

// The $ here makes sure the CardComps are rerendered
// when conflictPair changes.
$: conflictPair;

function takeIncumbent() {
  dispatch('conflictResolved', conflictPair.id);
}

function takeChallenger() {
  cardStoreIssuer
    .getCardStore(conflictPair.incumbent)
    .set(conflictPair.challenger);
  dispatch('conflictResolved', conflictPair.id);
}

</script>

<li class="conflict-frame">
  <CardComp cardStore={cardStoreIssuer.getCardStore(conflictPair.incumbent)} allowEditing={false} />
  <CardComp cardStore={CardStore(state, conflictPair.challenger)} allowEditing={false} />
  <button on:click={takeIncumbent}>Leaving existing card</button>
  <button on:click={takeChallenger}>Replace existing card with this version</button>
</li>
