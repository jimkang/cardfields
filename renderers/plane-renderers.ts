import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Plane, CollectionStoreType, StoreType, Thing } from '../types';
import curry from 'lodash.curry';
import { planeControlsClass } from '../consts';
import accessor from 'accessor';

export function RenderPlane({ storeRegistry, onEstablishChildContainer }) {
  return render;

  function render(
    collectionStore: CollectionStoreType,
    store: StoreType<Thing>
  ) {
    var plane: Plane = store.get();
    const parentSelector = `#${plane.id}`;
    var parentSel = select(parentSelector);

    var nameSel = establish(
      parentSel,
      'div',
      `#title-${plane.id}`,
      curry(initEditable)('title')
    );
    nameSel.text(plane.title);

    var descSel = establish(
      parentSel,
      'div',
      `#text-${plane.id}`,
      curry(initEditable)('text')
    );
    descSel.text(plane.text);

    establish(parentSel, 'button', '.remove-plane-button', initRemoveButton);

    var boardSel = establish(parentSel, 'svg', `#${plane.id}`, initBoard);
    boardSel
      .select('.plane-root')
      .selectAll('.card-container')
      .data(plane.cardPts, accessor('cardId'))
      .join('foreignObject')
      .attr(
        'class',
        (cardPt) => `card-container container-${cardPt.cardId}`,
        true
      )
      .attr('x', accessor({ path: 'pt/0' }))
      .attr('y', accessor({ path: 'pt/1' }));
    // TODO: z

    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${plane.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('blur', setProp);

      function setProp() {
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-plane-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function initBoard(sel) {
      sel.attr('id', plane.id).append('g').classed('plane-root', true);
    }

    function removeThing() {
      collectionStore.remove(plane);
      store.del();
    }
  }
}

export function RenderPlaneCollection({ parentSelector, addThing }) {
  return renderCollection;

  function renderCollection(collectionStore) {
    var parentSel = select(parentSelector);

    var itemRoot = establish(parentSel, 'div', '.planes-root', (sel) =>
      sel.attr('class', 'planes-root')
    );
    var controlsParent = establish(
      parentSel,
      'div',
      `.${planeControlsClass}`,
      (sel) => sel.attr('class', planeControlsClass)
    );
    establish(controlsParent, 'button', '.add-plane-button', initAddButton);

    var ids = collectionStore.getRaw();
    var containers = itemRoot
      .selectAll('.planes-root > .item-container')
      .data(ids, accessor('identity'));
    containers.exit().remove();
    containers
      .enter()
      .append('li')
      .classed('item-container', true)
      .classed('plane', true)
      .attr('id', accessor('identity'));

    function initAddButton(sel) {
      sel
        .attr('class', 'add-plane-button')
        .text('Add a plane')
        .on('click', addThing);
    }
  }
}
