import { select, event } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type {
  Plane,
  CollectionStoreType,
  StoreType,
  Thing,
  CardPt,
  ZonePt,
} from '../types';
import curry from 'lodash.curry';
import { cardsControlsClass, planeControlsClass } from '../consts';
import accessor from 'accessor';
import { zoom } from 'd3-zoom';
import { drag } from 'd3-drag';
import { storeRegistry } from '../wily.js/stores/store-registry';

export function RenderPlane({
  onEstablishCardContainer,
  addCard,
  onEstablishZoneContainer,
  addZone,
}) {
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

    var controlsParent = establish(
      parentSel,
      'div',
      `.${cardsControlsClass}`,
      (sel) => sel.attr('class', cardsControlsClass)
    );
    establish(controlsParent, 'button', '.add-card-button', initAddCardButton);
    establish(controlsParent, 'button', '.add-zone-button', initAddZoneButton);

    var boardSel = establish(parentSel, 'svg', `#${plane.id}`, initBoard);
    var zoomRootSel = establish(boardSel, 'g', '.zoom-root', initZoom);
    var planeRoot = establish(zoomRootSel, 'g', '.plane-root', (sel) =>
      sel.classed('plane-root', true)
    );
    var zoneRoot = establish(planeRoot, 'g', '.zone-root', (sel) =>
      sel.classed('zone-root', true)
    );

    var containerSel = planeRoot
      .selectAll('.card')
      .data(plane.cardPts, accessor('cardId'));

    containerSel.exit().remove();

    var newContainerSel = containerSel
      .enter()
      .append('foreignObject')
      .attr('class', (cardPt) => `card container-${cardPt.cardId}`, true)
      .call(drag().on('drag', onDrag).on('end', onDragEnd));

    newContainerSel
      // Never forget! A parent element with this namespace
      // is necessary for html elements in a foreignObject to
      // be sized correctly.
      .append('xhtml:div')
      .each(onEstablishCardContainer);

    newContainerSel
      .merge(containerSel)
      .attr('x', accessor({ path: 'pt/0' }))
      .attr('y', accessor({ path: 'pt/1' }));
    // TODO: z

    var zoneContainerSel = zoneRoot
      .selectAll('.zone')
      .data(plane.zonePts, accessor('zoneId'));
    zoneContainerSel.exit().remove();
    var newZoneContainerSel = zoneContainerSel
      .enter()
      .append('g')
      .attr('class', (zonePt) => `zone container-${zonePt.zoneId}`, true)
      .call(drag().on('drag', onZoneDrag).on('end', onZoneDragEnd))
      .each(onEstablishZoneContainer);
    newZoneContainerSel
      .merge(zoneContainerSel)
      .attr('transform', getZoneContainerTransform);

    function onDrag() {
      select(this).attr('x', event.x).attr('y', event.y);
    }

    function onZoneDrag() {
      select(this).attr('transform', `translate(${event.x}, ${event.y})`);
    }

    function onDragEnd(cardPt: CardPt) {
      var cardPts: CardPt[] = store.get().cardPts;
      var changeTarget: CardPt = cardPts.find(
        (cp) => cp.cardId === cardPt.cardId
      );
      changeTarget.pt = [event.x, event.y, changeTarget.pt[2]];
      // Is it good enough to have to set the entire
      // cardPts prop? Should there be a 'persist' method?
      store.setPartSilent({ cardPts });
    }

    function onZoneDragEnd(zonePt: ZonePt) {
      var zonePts: ZonePt[] = store.get().zonePts;
      var changeTarget: ZonePt = zonePts.find(
        (cp) => cp.zoneId === zonePt.zoneId
      );
      changeTarget.center = [event.x, event.y];
      store.setPartSilent({ zonePts });
    }

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
      sel.attr('id', plane.id);
    }

    function initZoom(sel) {
      sel.attr('class', 'zoom-root');
      var zoomer = zoom().on('zoom', onZoom);
      boardSel.call(zoomer);
    }

    function onZoom() {
      zoomRootSel.attr('transform', event.transform);
    }

    function removeThing() {
      collectionStore.remove(plane);
      store.del();
    }

    function initAddCardButton(sel) {
      sel
        .attr('class', 'add-card-button')
        .text('Add a card')
        .on('click', addCard);
    }

    function initAddZoneButton(sel) {
      sel
        .attr('class', 'add-zone-button')
        .text('Add a zone')
        .on('click', addZone);
    }
  }
}

export function RenderPlaneCollection({ parentSelector, addThing }) {
  return renderCollection;

  function renderCollection(collectionStore) {
    var ids = collectionStore.getRaw();
    var parentSel = select(parentSelector);

    var controlsParent = establish(
      parentSel,
      'div',
      `.${planeControlsClass}`,
      (sel) => sel.attr('class', planeControlsClass)
    );
    establish(controlsParent, 'button', '.add-plane-button', initAddButton);
    var selectSel = establish(
      controlsParent,
      'select',
      '.select-plane-button',
      initSelect
    );

    var itemRoot = establish(parentSel, 'div', '.planes-root', (sel) =>
      sel.attr('class', 'planes-root')
    );
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

    selectPlane.bind(selectSel.node())();

    function initAddButton(sel) {
      sel
        .attr('class', 'add-plane-button')
        .text('Add a plane')
        .on('click', addThing);
    }

    function initSelect(sel) {
      // TODO: Allow selected plane to be passed in.
      sel
        .attr('class', 'select-plane')
        .attr('selected', ids.length > 0 ? ids[0] : '')
        .attr('value', ids[0])
        .on('change', selectPlane);
      sel
        .selectAll('option')
        .data(ids.map((id) => storeRegistry.getStore(id).get()))
        .join('option')
        .attr('value', accessor())
        .text(accessor('title'));
    }

    function selectPlane() {
      var selectedId = this.value;
      itemRoot
        .selectAll('.planes-root > .item-container')
        .classed('hidden', (id) => id !== selectedId);
    }
  }
}

// Should this translate by the top left corner?
function getZoneContainerTransform(zonePt: ZonePt) {
  return `translate(${zonePt.center[0]}, ${zonePt.center[1]})`;
}
