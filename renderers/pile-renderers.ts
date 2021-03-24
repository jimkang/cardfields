import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Pile, ThingStoreType, CollectionStoreType } from '../types';
import curry from 'lodash.curry';

export function RenderPile() {
  return render;

  function render(
    collectionStore: CollectionStoreType,
    containingDeckStore: ThingStoreType,
    store: ThingStoreType
  ) {
    var pile: Pile = store.get();
    const parentSelector = `#${pile.id}`;
    var parentSel = select(parentSelector);

    var nameSel = establish(
      parentSel,
      'div',
      `#title-${pile.id}`,
      curry(initEditable)('title')
    );
    nameSel.text(pile.title);

    var descSel = establish(
      parentSel,
      'div',
      `#text-${pile.id}`,
      curry(initEditable)('text')
    );
    descSel.text(pile.text);

    establish(parentSel, 'button', '.remove-pile-button', initRemoveButton);

    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${pile.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('blur', setProp);

      function setProp() {
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-pile-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function removeThing() {
      collectionStore.remove(pile);
      store.del();
    }
  }
}

export function RenderPileCollection({ parentSelector, addThing }) {
  return renderCollection;

  function renderCollection(collectionStore) {
    var parentSel = select(parentSelector);

    var itemRoot = establish(parentSel, 'div', '.piles-root', (sel) =>
      sel.attr('class', 'piles-root')
    );
    var controlsParent = establish(
      parentSel,
      'div',
      '.pile-collection-controls',
      (sel) => sel.attr('class', 'piles-collection-controls')
    );
    establish(controlsParent, 'button', '.add-pile-button', initAddButton);

    var ids = collectionStore.getRaw();
    var containers = itemRoot.selectAll('.item-container').data(ids, (x) => x);
    containers.exit().remove();
    containers
      .enter()
      .append('li')
      .classed('item-container', true)
      .attr('id', (x) => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-pile-button')
        .text('Add a pile')
        .on('click', addThing);
    }
  }
}
