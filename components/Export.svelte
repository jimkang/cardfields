<script>
export let allCardsStore;

let blobURL;

function onExportClick() {
  var blob = new Blob([JSON.stringify($allCardsStore, null, 2)], { type: 'application/json' });
  blobURL = window.URL.createObjectURL(blob);
}

function revokeDownload() {
  const urlCopy = blobURL.slice();
  blobURL = null;
  debugger
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
