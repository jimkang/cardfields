import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Card, CollectionStoreType, Pile, StoreType, Thing } from '../types';
import curry from 'lodash.curry';
import { cardsControlsClass } from '../consts';
import accessor from 'accessor';
import { storeRegistry } from '../wily.js/stores/store-registry';

export function RenderCard() {
  return render;

  function render(
    collectionStore: CollectionStoreType,
    containingPileStore: StoreType<Thing>,
    pileCollectionStore: CollectionStoreType,
    store: StoreType<Thing>
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
    establish(parentSel, 'button', '.move-card-button', initMoveButton);

    establish(parentSel, 'div', '.move-view', initMoveView);

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

    function initMoveButton(sel) {
      sel
        .attr('class', 'move-card-button')
        .on('click', showMoveView)
        .text('Move');
    }

    function initMoveView(sel) {
      sel.attr('class', 'move-view hidden');
      sel.append('h3').text('Move to this pile');
      sel.append('span').attr('class', 'button-container');
    }

    function removeThing() {
      collectionStore.remove(card);
      store.del();
    }

    function showMoveView() {
      var viewSel = parentSel.select('.move-view');
      var buttonRoot = viewSel.select('.button-container');
      buttonRoot
        .selectAll('button')
        .data(pileCollectionStore.get(), accessor('id'))
        .join('button')
        .text(accessor('title'))
        .on('click', moveToPile);
      viewSel.classed('hidden', false);
    }

    // This is technically an updater. Maybe it should go in that directory.
    function moveToPile(pile: Pile) {
      var destCardCollectionStore = storeRegistry.getCollectionStore(
        'card',
        pile.id
      );
      collectionStore.remove(card);
      destCardCollectionStore.add(card);
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
