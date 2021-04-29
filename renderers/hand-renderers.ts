import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';

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
