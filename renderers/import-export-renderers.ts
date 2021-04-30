import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';

export function RenderPortControls(
  parentSelector,
  exportToPersistence,
  importToPersistence
) {
  var exportBlobURL;

  return render;

  function render() {
    var parentSel = select(parentSelector);
    establish(parentSel, 'button', '.export-button', initExportButton);

    function initExportButton(sel) {
      sel
        .attr('class', 'export-button')
        .on('click', onExportClick)
        .text('Export everything');
    }

    function onExportClick() {
      exportBlobURL = exportToPersistence();
      parentSel
        .append('a')
        .attr('class', 'download-link')
        .attr('href', exportBlobURL)
        .attr('download', 'cards.json')
        .text('Download export data')
        .on('click', revokeDownload);
    }

    function revokeDownload() {
      const urlCopy = exportBlobURL.slice();
      exportBlobURL = null;
      parentSel.select('.download-link').remove();
      // Code after revokeDownload doesn't seem
      // to execute?!
      URL.revokeDownload(urlCopy);
    }
  }
}
