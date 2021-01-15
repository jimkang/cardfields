<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import ExportComp from '../../components/Export.svelte';
import ImportComp from '../../components/Import.svelte';
import State from '../../stores/state';
import { CardStoreIssuer } from '../../stores/card-store-issuer';

let selectedProfile = 'main';
let profiles = [
  'main',
  'test'
];

let state;
let allCardsStore;
let cardStoreIssuer;

$: state;
$: allCardsStore;

function onProfileChange() {
  state = State(selectedProfile);
  allCardsStore = state.allCardsStore;
  cardStoreIssuer = CardStoreIssuer(state);
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

  {#each $allCardsStore.map(cardStoreIssuer.getCardStore) as cardStore}
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
