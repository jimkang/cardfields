import { select } from 'd3-selection';
import { CardRef, StoreType, Thing, View } from '../types';
import { establish } from '../wily.js/rendering/establish';
import { RenderCard } from './card-renderers';
import { storeRegistry } from '../wily.js/stores/store-registry';

export function RenderHandControls(
  parentSelector,
  onShowHand,
  onHideHand = null
) {
  return render;

  function render() {
    var parentSel = select(parentSelector);
    var showHandButtonSel = establish(
      parentSel,
      'button',
      '.show-hand-button',
      initShowHandButton
    );
    var hideHandButtonSel = establish(
      parentSel,
      'button',
      '.hide-hand-button hidden',
      initHideHandButton
    );

    function initShowHandButton(sel) {
      sel
        .attr('class', 'show-hand-button')
        .on('click', onShowHandClick)
        .text('Show hand');
    }

    function onShowHandClick() {
      onShowHand();
      showHandButtonSel.classed('hidden', true);
      hideHandButtonSel.classed('hidden', false);
    }

    function initHideHandButton(sel) {
      sel
        .attr('class', 'hide-hand-button')
        .on('click', onHideHandClick)
        .text('Hide hand');
    }

    function onHideHandClick() {
      if (onHideHand) {
        onHideHand();
      }
      hideHandButtonSel.classed('hidden', true);
      showHandButtonSel.classed('hidden', false);
    }
  }
}

export function RenderHand() {
  var renderCard = RenderCard();

  return render;

  function render({ viewStore, parentSelector }: { viewStore: StoreType<Thing>, parentSelector: string }) {
    var parentSel = select(parentSelector);
    var view: View = viewStore.get();
    console.log(view.cardRefs);
    view.cardRefs.forEach(renderCardFromRef)
    // TODO: Make a container for each card.

    function renderCardFromRef(cardRef: CardRef) {
      renderCard(
        parentSel,
        storeRegistry.getStore(cardRef.homePile.id),
        null,
        storeRegistry.getStore(cardRef.card.id)
      );
    }
  }
}