import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Zone, StoreType, Thing } from '../types';
import curry from 'lodash.curry';
import accessor from 'accessor';

export function RenderZone({ deleteZone }) {
  return renderZone;

  function renderZone(store: StoreType<Thing>, parentEl: object = null) {
    if (!store) {
      console.error(new Error('Store missing'));
      return;
    }

    var zone: Zone = store.get();
    var parentSel;
    if (parentEl) {
      parentSel = select(parentEl);
    } else {
      parentSel = select(`.zone-container-${zone.id}`);
    }

    var zoneActualSel = establish(parentSel, 'rect', '.zone-actual', (sel) =>
      sel.classed('zone-actual', true).datum(zone)
    );
    zoneActualSel
      .attr('width', accessor('width'))
      .attr('height', accessor('height'))
      .attr('fill', accessor('color'));

    var zoneHTMLContainerSel = establish(
      parentSel,
      'foreignObject',
      'foreignObject',
      (sel) => sel.attr('width', zone.width).attr('height', zone.height)
    );
    var zoneHTMLAreaSel = establish(zoneHTMLContainerSel, 'xhtml:div', 'div');
    var nameSel = establish(
      zoneHTMLAreaSel,
      'div',
      `#title-${zone.id}`,
      curry(initEditable)('title')
    );
    nameSel.text(zone.title);

    establish(
      zoneHTMLAreaSel,
      'button',
      '.remove-zone-button',
      initRemoveButton
    );

    // TODO: Factor this out.
    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${zone.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('mousedown', stopPropagation)
        .on('blur', setProp);

      function setProp() {
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-zone-button')
        .on('click', onDeleteClick)
        .text('Delete');
    }

    function onDeleteClick() {
      deleteZone(zone);
    }
  }
}

function stopPropagation() {
  event.stopPropagation();
}
