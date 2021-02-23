<script lang="ts">
// @ts-check
import CardActionsContainer from '../../components/CardActionsContainer.svelte';
import ExportComp from '../../components/Export.svelte';
import ImportComp from '../../components/Import.svelte';
import CardStore from '../../stores/card-store';
//import PileStore from '../../stores/pile-store';
import type { Card, Pile, StoreIssuerType, CardStoreType, PileStoreType } from '../../types';
import { initProfiles } from '../../init/init-profiles';
import fw from 'lodash.findwhere';
import curry from 'lodash.curry';
import { clearinghouse } from '../../stores/clearinghouse';
import { mainProfileId } from '../../names';

initProfiles();
// TODO: Profiles store and Profile store.
// Hydrate the profile ids.
var profileIdsStore = clearinghouse.getCollectionStore('profile');
let selectedProfileId = mainProfileId;
var profiles = profileIdsStore.get().map(clearinghouse.getThing);
console.log('hey', profiles);

function onProfileChange() {
}

onProfileChange();
</script>

<main>
  <h1>Stores experiment</h1>

  <h2>Profile</h2>
  <select bind:value={selectedProfileId} on:change={onProfileChange}>
{#each profiles as profile}
      { console.log('profile', profile) }
      <option value={profile.id}>{profile.title}</option>
    {/each}
  </select>

<!--
  {#each $allCardsStore as cardStore}
    <CardActionsContainer cardStore={cardStoreIssuer.getStore(cardStore)} {allPilesStore} {pileStoreIssuer} />
  {/each}

  <button on:click={state.createCard}>Add new card</button>

  {#if $allPilesStore}
    <ExportComp {allCardsStore} {allPilesStore} />
  {/if}
-->

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
      <dt>Delete all of the cards.</dt>
    </dl>
  </div>

  <!--
  <ImportComp {pileStoreIssuer} {cardStoreIssuer} {state} />
  -->
</main>
