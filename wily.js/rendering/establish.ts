// parentSel should be a d3 selection.
export function establish(parentSel, childTag: string, childSelector: string, initFn) {
  var childSel = parentSel.select(childSelector);
  if (childSel.empty()) {
    childSel = parentSel.append(childTag);
    initFn(childSel);
  }
  return childSel;
}
