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
  <h1>Stores experiment</h1>

  <h2>Profile</h2>
  <select bind:value={selectedProfile} on:change={onProfileChange}>
    {#each profiles as profile}
      <option value={profile}>{profile}</option>
    {/each}
  </select>

  {#each $allCardsStore.map(cardStoreIssuer.getCardStore) as cardStore}
    <CardActionsContainer cardStore={cardStore} />
  {/each}

  <button on:click={state.createCard}>Add new card</button>

  <ExportComp allCardsStore={allCardsStore} />

  <div>
    Import test script:
    <dl>
      <dt>Delete all of the cards.</dt>
      <dt>Click import and select import-test-batch-0.json.</dt>
      <dd>Should say that 3 cards were imported.</dd>
      <dd>Those three cards should appear in the list.</dd>
      <dt>Reload the page.</dt>
      <dd>Those three cards should still appear in the list.</dd>
      <dt>Click import and select import-test-batch-1.json.</dt>
      <dd>Should say that one card, "New From Import" was imported.</dd>
      <dd>Two conflict frames should appear.</dd>
      <dt>Click to import a "challenger" card.</dt>
      <dd>That conflict frame should disappear.</dd>
      <dd>The challenger card should appear in the cards list.</dd>
      <dt>Click to keep an "incumbent" card.</dt>
      <dd>That conflict frame should disappear.</dd>
    </dl>
  </div>
  <ImportComp allCardsStore={allCardsStore} cardStoreIssuer={cardStoreIssuer} state={state} />
</main>
