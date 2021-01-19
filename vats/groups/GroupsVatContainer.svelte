<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import PileActionsContainer from '../../components/PileActionsContainer.svelte';
import ExportComp from '../../components/Export.svelte';
import ImportComp from '../../components/Import.svelte';
import State from '../../stores/state';
import CardStore from '../../stores/card-store';
import PileStore from '../../stores/pile-store';
import type { CardStoreType } from '../../stores/card-store';
import type { PileStoreType } from '../../stores/pile-store';
import { StoreIssuer } from '../../stores/store-issuer';
import type { StoreIssuerType } from '../../stores/store-issuer';
import type { Card } from '../../things/card';
import type { Pile } from '../../things/pile';

let selectedProfile = 'main';
let profiles = [
  'main',
  'test'
];

let state;
let allCardsStore;
let allPilesStore;
let cardStoreIssuer: StoreIssuerType<Card, CardStoreType>;
let pileStoreIssuer: StoreIssuerType<Pile, PileStoreType>;

$: state;
$: allCardsStore;
$: allPilesStore;

function onProfileChange() {
  state = State(selectedProfile);
  allCardsStore = state.allCardsStore;
  allPilesStore = state.allPilesStore;
  cardStoreIssuer = StoreIssuer<Card, CardStoreType>(state, CardStore);
  pileStoreIssuer = StoreIssuer<Pile, PileStoreType>(state, PileStore);
}

onProfileChange();
</script>
<div class="outer" style="display: flex">
<main style="flex-grow: 1; width: 30em">
  <h1>Groups vat</h1>

  <h2>Profile</h2>
  <select bind:value={selectedProfile} on:change={onProfileChange}>
    {#each profiles as profile}
      <option value={profile}>{profile}</option>
    {/each}
  </select>

  <button on:click={state.createPile}>Add new pile</button>

  <h2>All piles</h2>

  {#each $allPilesStore as pileStore}
    <PileActionsContainer state={state} pileStore={pileStoreIssuer.getStore(pileStore)} cardStoreIssuer={cardStoreIssuer} />
  {/each}

  <h2>All cards</h2>

  {#each $allCardsStore as cardStore}
    <CardActionsContainer cardStore={cardStoreIssuer.getStore(cardStore)} />
  {/each}
  <button on:click={state.createCard}>Add new card</button>

  <ExportComp allCardsStore={allCardsStore} />
  <ImportComp allCardsStore={allCardsStore} cardStoreIssuer={cardStoreIssuer} state={state} />

  </main>

  <div class="test-script" style="max-width: 20rem">
    Piles test script:
    <dl>
      <dt>Delete all piles</dt>
      <dt>Create a new pile named "Discard".</dt>
      <dt>Reload.</dt>
      <dd>It should still exist.</dd>
      <dt>Create another pile named "Draw".</dt>
      <dt>Add three cards named "Discard A", "Discard B", and "Discard C" to the Discard pile.</dt>
      <dt>Reload.</dt>
      <dd>They should still be in that pile and also in the all cards list.</dd>
      <dt>Add two cards named "Draw A" and "Draw B" to the Draw pile.</dt>
      <dt>Reload.</dt>
      <dd>They should still be in that pile and also in the all cards list. The Discard pile should be in the same pile as before.</dd>
      <dt>Set the description Discard B to "Giza Power Plant."</dt>
      <dt>Set the description Draw B to "Hovering Lifeless."</dt>
      <dd>The descriptions should also change in the all cards list.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Create another pile named "The Void".</dt>
      <dt>Remove Discard A from the Discard pile.</dt>
      <dd>Discard A should not be in the Discard pile, but it should be in the all cards list.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Move Discard B to The Void pile.</dt>
      <dt>Delete the Discard pile.</dt>
      <dd>Discard C should still be in the All Cards list, even if it isn't in a pile.</dd>
      <dt>Delete Draw A from the All Cards list.</dt>
      <dd>It should be gone from the Draw pile.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Move Draw A to The Void.</dt>
      <dt>Move Discard B to Draw.</dt>
      <dt>Add a card named "Draw D" to the Draw pile.</dt>
      <dd>The Void should contain Draw A.</dd>
      <dd>Draw should Discard B and D.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
    </dl>
    </div>
</div>
