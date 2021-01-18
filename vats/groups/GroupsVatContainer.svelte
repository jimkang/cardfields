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
let cardStoreIssuer;
let pileStoreIssuer;

$: state;
$: allCardsStore;
$: allPilesStore;

function onProfileChange() {
  state = State(selectedProfile);
  allCardsStore = state.allCardsStore;
  allPilesStore = state.allPilesStore;
  cardStoreIssuer = StoreIssuer<Card>(state, CardStore);
  pileStoreIssuer = StoreIssuer<Pile>(state, PileStore);
}

onProfileChange();
</script>

<main>
  <h1>Groups vat</h1>

  <h2>Profile</h2>
  <select bind:value={selectedProfile} on:change={onProfileChange}>
    {#each profiles as profile}
      <option value={profile}>{profile}</option>
    {/each}
  </select>

  <button on:click={state.createPile}>Add new pile</button>

  <h2>All piles</h2>

  {#each $allPilesStore.map(pileStoreIssuer.getStore) as pileStore}
    <PileActionsContainer pileStore={pileStore} cardStoreIssuer={cardStoreIssuer} />
  {/each}

  <h2>All cards</h2>

  {#each $allCardsStore.map(cardStoreIssuer.getStore) as cardStore}
    <CardActionsContainer cardStore={cardStore} />
  {/each}
  <button on:click={state.createCard}>Add new card</button>

  <ExportComp allCardsStore={allCardsStore} />
  <ImportComp allCardsStore={allCardsStore} cardStoreIssuer={cardStoreIssuer} state={state} />

  <div>
    Piles test script:
    <dl>
      <dt>TODO</dt>
    </dl>
  </div>
</main>
