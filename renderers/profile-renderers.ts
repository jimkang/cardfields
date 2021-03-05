import { select } from 'd3-selection';
import { establish } from '../wily.js/rendering/establish';
import type { Profile, ThingStoreType, CollectionStoreType } from '../types';
import curry from 'lodash.curry';

export function RenderProfile({ parentSelector }) {
  return render;

  function render(collectionStore: CollectionStoreType, store: ThingStoreType) {
    var profile: Profile = store.get();
    var parentSel = select(parentSelector);
    var nameSel = establish(parentSel, 'div', `#title-${profile.id}`, curry(initEditable)('title'));
    nameSel.text(profile.title);
    
    var descSel = establish(parentSel, 'div', `#text-${profile.id}`, curry(initEditable)('text'));
    descSel.text(profile.text);
    establish(parentSel, 'button', '.remove-profile-button', initRemoveButton);

    function initEditable(prop: string, sel) {
      sel
        .attr('id', `${prop}-${profile.id}`)
        .attr('class', prop)
        .attr('contenteditable', true)
        .on('blur', setProp);

      function setProp() {
        // Gah, this [key] notation!
        store.setPart({ [prop]: select(this).text() });
      }
    }

    function initRemoveButton(sel) {
      sel
        .attr('class', 'remove-profile-button')
        .on('click', removeThing)
        .text('Delete');
    }

    function removeThing() {
      collectionStore.remove(profile);
      store.del();
    }
  }
}

export function RenderProfileCollection({ parentSelector, addThing }) {
  var parentSel = select(parentSelector);
  var itemRoot = parentSel.select('.profiles-root');
  var controlsParent = parentSel.select('.profiles-collection-controls');

  return renderCollection;

  function renderCollection(collectionStore) {
    establish(controlsParent, 'button', '.add-profile-button', initAddButton);
  
    var ids = collectionStore.getRaw();
    var containers = itemRoot.selectAll('.item-container').data(ids, x => x);
    containers.exit().remove();
    containers.enter()
      .append('li')
      .classed('item-container', true)
      .attr('id', x => x);

    function initAddButton(sel) {
      sel
        .attr('class', 'add-profile-button')
        .text('Add a profile')
        .on('click', addThing);
    }
  }
}
