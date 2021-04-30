import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Deck, CollectionStoreType, StoreType, Thing } from '../types';
import curry from 'lodash.curry';
import { pilesContainerClass } from '../consts';
//import { RenderPileCollection } from './pile-renderers';
//import { storeRegistry as registry } from '../wily.js/stores/store-registry';

// TODO: A lot of these are unnecessary.
export function RenderDeck({
  parentSelector,
  renderPileCollection,
  pileCollectionStore,
  onEstablishChildContainer,
}) {
  //var renderPileCollection = RenderPileCollection({
  //parentSelector: `${parentSelector} .pilesContainerClass`,
  //addThing: addPile,
  //});

  return render;

  function render(
    collectionStore: CollectionStoreType,
    store: StoreType<Thing>,
    activeDeckIdentfier: StoreType<Thing>
  ) {
    var deck: Deck = store.get();
    const isActive = activeDeckIdentfier.get().deck === store.get().id;

    var parentSel = select(parentSelector);
    parentSel.classed('selected', isActive);

    establish(
      parentSel,
      'button',
      `#deck-${deck.id}`,
      curry(initActiveButton)('deck')
    );

    var nameSel = establish(
      parentSel,
      'div',
      `#title-${deck.id}`,
      curry(initEditable)('title')
    );
    nameSel.text(deck.title);

    var descSel = establish(
      parentSel,
      'div',
      `#text-${deck.id}`,
      curry(initEditable)('text')
    );
    descSel.text(deck.text);

    establish(parentSel, 'div', `.${pilesContainerClass}`, initPilesContainer);

    establish(parentSel, 'button', '.remove-deck-button', initRemoveButton);

    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${deck.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('blur', setProp);

      function setProp() {
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initActiveButton(prop: string, sel) {
      sel
        .attr('id', `${prop}-${deck.id}`)
        .attr('class', prop)
        .text('Activate')
        .on('click', setProp);

      function setProp() {
        activeDeckIdentfier.setPart({ [prop]: store.get().id });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-deck-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function initPilesContainer(sel) {
      sel.attr('class', pilesContainerClass);
      renderPileCollection(pileCollectionStore);
      onEstablishChildContainer(sel.node());
      // Should never need this again.
      onEstablishChildContainer = null;
    }

    function removeThing() {
      collectionStore.remove(deck);
      store.del();
    }
  }
}

export function RenderDeckCollection({ parentSelector, addThing }) {
  var parentSel = select(parentSelector);
  var itemRoot = parentSel.select('.decks-root');
  var controlsParent = parentSel.select('.decks-collection-controls');

  return renderCollection;

  function renderCollection(collectionStore) {
    establish(controlsParent, 'button', '.add-deck-button', initAddButton);

    var ids = collectionStore.getRaw();
    // Be careful about only messing with direct children!
    var containers = itemRoot
      .selectAll('.decks-root > .item-container')
      .data(ids, (x) => x);
    containers.exit().remove();
    containers
      .enter()
      .append('li')
      .classed('item-container', true)
      .attr('id', (x) => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-deck-button')
        .text('Add a deck')
        .on('click', addThing);
    }
  }
}
