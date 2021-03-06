import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Pile, CollectionStoreType, StoreType, Thing } from '../types';
import curry from 'lodash.curry';
import { cardsContainerClass, pilesControlsClass } from '../consts';

export function RenderPile({
  onEstablishChildContainer,
  renderCardCollection,
  cardCollectionStore,
}) {
  return render;

  function render(
    collectionStore: CollectionStoreType,
    containingDeckStore: StoreType<Thing>,
    store: StoreType<Thing>
  ) {
    var pile: Pile = store.get();
    if (!pile) {
      throw new Error('renderPile passed an empty pile.');
    }
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

    establish(parentSel, 'div', `.${cardsContainerClass}`, initCardsContainer);

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

    function initCardsContainer(sel) {
      sel.attr('class', cardsContainerClass);
      renderCardCollection(cardCollectionStore);
      if (onEstablishChildContainer) {
        onEstablishChildContainer(sel.node());
        // Should never need this again.
        onEstablishChildContainer = null;
      }
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
      `.${pilesControlsClass}`,
      (sel) => sel.attr('class', pilesControlsClass)
    );
    establish(controlsParent, 'button', '.add-pile-button', initAddButton);

    var ids = collectionStore.getRaw();
    // Be careful about only messing with direct children!
    var containers = itemRoot
      .selectAll('.piles-root > .item-container')
      .data(ids, (x) => x);
    containers.exit().remove();
    containers
      .enter()
      .append('li')
      .classed('item-container', true)
      .classed('pile', true)
      .attr('id', (x) => x);
    // No update selection; nothing ever needs to be updated.

    function initAddButton(sel) {
      sel
        .attr('class', 'add-pile-button')
        .text('Add a pile')
        .on('click', addThing);
    }
  }
}
