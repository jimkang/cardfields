import { noThrowJSONParse as parse } from '../wily.js/utils/no-throw-json-parse';

export function exportFromLocalStorage() {
  var blob = new Blob([JSON.stringify(localStorage, null, 2)], {
    type: 'application/json',
  });
  return window.URL.createObjectURL(blob);
}

// True if successful.
export function importToLocalStorage(data: string): boolean {
  var parsed = parse(data);
  if (!parsed) {
    return false;
  }

  window.localStorage.clear();

  for (var key in parsed as object) {
    window.localStorage.setItem(key, parsed[key]);
  }

  return true;
}
