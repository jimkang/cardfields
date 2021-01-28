<script>
export let allCardsStore;
export let allPilesStore;
import { dehydratePile } from '../things/pile';

let blobURL;

function onExportClick() {
  var exportPkg = {
    cards: $allCardsStore,
    piles: $allPilesStore.map(dehydratePile)
  };
  var blob = new Blob([JSON.stringify(exportPkg, null, 2)], { type: 'application/json' });
  blobURL = window.URL.createObjectURL(blob);
}

function revokeDownload() {
  const urlCopy = blobURL.slice();
  blobURL = null;
  // Code after revokeDownload doesn't seem
  // to execute?!
  URL.revokeDownload(urlCopy);
}
</script>

<div class="export-zone">
  <button on:click={onExportClick}>Export cards</button>

  {#if blobURL}
    <a href={blobURL} download="cards.json" on:click={revokeDownload}>Download exported cards</a>
  {/if}
</div>
