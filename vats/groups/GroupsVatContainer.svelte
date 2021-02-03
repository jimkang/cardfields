<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import PileActionsContainer from '../../components/PileActionsContainer.svelte';
import ExportComp from '../../components/Export.svelte';
import ImportComp from '../../components/Import.svelte';
import State from '../../stores/state';
import CardStore from '../../stores/card-store';
import PileStore from '../../stores/pile-store';
import { StoreIssuer } from '../../stores/store-issuer';
import { getCardStores } from '../../stores/card-store';
import type { Card, Pile, CardStoreType, PileStoreType, StoreIssuerType } from '../../types';

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

  {#if $allCardsStore && $allPilesStore}
    {#each $allPilesStore as pileStore}
      <PileActionsContainer {state} pileStore={pileStoreIssuer.getStore(pileStore)} {cardStoreIssuer} {pileStoreIssuer} />
    {/each}
  {/if}

  <h2>All cards</h2>

  <!-- This guard is necessary to prevent the
  CardActionsContainers from being created before
  their props are ready. -->
  {#if $allPilesStore}
    {#each getCardStores(cardStoreIssuer, $allCardsStore) as cardStore}
      <CardActionsContainer {cardStore} {allPilesStore} {pileStoreIssuer} />
    {/each}
  {/if}
  <button on:click={state.createCard}>Add new card</button>

  <ExportComp {allCardsStore} {allPilesStore} />
  <ImportComp {state} {cardStoreIssuer} {pileStoreIssuer} />

  </main>

  <div class="test-script" style="max-width: 20rem">
    Piles test script:
    <dl>
      <dt>Delete all piles</dt>
      <dt>Create a new pile named "Discard".</dt>
      <dt>Reload.</dt>
      <dd>It should still exist.</dd>
      <dt>Create another pile named "Draw".</dt>
      <dt>Add three cards named "A", "B", and "C" to the Discard pile.</dt>
      <dt>Reload.</dt>
      <dd>They should still be in that pile and also in the all cards list.</dd>
      <dt>Add two cards named "D" and "E" to the Draw pile.</dt>
      <dt>Reload.</dt>
      <dd>They should still be in that pile and also in the all cards list. The Discard pile should be in the same pile as before.</dd>
      <dt>Set the description B to "Giza Power Plant."</dt>
      <dt>Set the description E to "Hovering Lifeless."</dt>
      <dd>The descriptions should also change in the all cards list.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Create another pile named "The Void".</dt>
      <dd>The action containers from existing cards should list The Void as a place to move. (Not working!)</dd>
      <dt>Remove A from the Discard pile.</dt>
      <dd>A should not be in the Discard pile, but it should be in the all cards list.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Move B to The Void pile.</dt>
      <dd>Expected contents:
        <dl>
          <dt>Discard</dt>
          <dd>C</dd>
          <dt>Draw</dt>
          <dd>D, E</dd>
          <dt>The Void</dt>
          <dd>B</dd>
        </dl>
      </dd>
      <dt>Export everything.</dt>
      <dt>Delete everything except The Void pile and card B.</dt>
      <dt>Import everything.</dt>
      <dt>Resolve conflicts by taking the piles and cards on the right.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Delete the Discard pile.</dt>
      <dd>C should still be in the All Cards list, even if it isn't in a pile.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Move D to The Void.</dt>
      <dt>Move B to Draw.</dt>
      <dt>Add a card named "F" to the Draw pile.</dt>
      <dd>The Void should contain D.</dd>
      <dd>Draw should B, E, and F.</dd>
      <dt>Reload.</dt>
      <dd>Everything should be the same.</dd>
      <dt>Delete D from the All Cards list.</dt>
      <dd>It should be gone from the Void pile.</dd>
      <dt>Import from the previous export.</dt>
      <dt>Resolve conflicts by taking the piles and cards on the right. (Do cards before piles.)</dt>
      <dd>Expected contents:
        <dl>
          <dt>Discard</dt>
          <dd>C</dd>
          <dt>Draw</dt>
          <dd>D, E</dd>
          <dt>The Void</dt>
          <dd>B</dd>
        </dl>
      </dd>
    </dl>
    </div>
</div>
