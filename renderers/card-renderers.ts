import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Card, ThingStoreType, CollectionStoreType } from '../types';
import curry from 'lodash.curry';
import { cardsControlsClass } from '../consts';

export function RenderCard() {
  return render;

  function render(
    collectionStore: CollectionStoreType,
    containingPileStore: ThingStoreType,
    store: ThingStoreType
  ) {
    var card: Card = store.get();
    const parentSelector = `#${card.id}`;
    var parentSel = select(parentSelector);

    var nameSel = establish(
      parentSel,
      'div',
      `#title-${card.id}`,
      curry(initEditable)('title')
    );
    nameSel.text(card.title);

    var descSel = establish(
      parentSel,
      'div',
      `#text-${card.id}`,
      curry(initEditable)('text')
    );
    descSel.text(card.text);

    // TODO: Picture.

    establish(parentSel, 'button', '.remove-card-button', initRemoveButton);

    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${card.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('blur', setProp);

      function setProp() {
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-card-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function removeThing() {
      collectionStore.remove(card);
      store.del();
    }
  }
}

export function RenderCardCollection({ parentSelector, addThing }) {
  return renderCollection;

  function renderCollection(collectionStore) {
    var parentSel = select(parentSelector);

    var itemRoot = establish(parentSel, 'div', '.cards-root', (sel) =>
      sel.attr('class', 'cards-root')
    );
    var controlsParent = establish(
      parentSel,
      'div',
      `.${cardsControlsClass}`,
      (sel) => sel.attr('class', cardsControlsClass)
    );
    establish(controlsParent, 'button', '.add-card-button', initAddButton);

    var ids = collectionStore.getRaw();
    var containers = itemRoot.selectAll('.item-container').data(ids, (x) => x);
    containers.exit().remove();
    containers
      .enter()
      .append('li')
      .classed('item-container', true)
      .classed('card', true)
      .attr('id', (x) => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-card-button')
        .text('Add a card')
        .on('click', addThing);
    }
  }
}
