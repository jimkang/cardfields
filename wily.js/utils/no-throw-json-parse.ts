export function noThrowJSONParse(s: string, defaultVal = []): unknown {
  var parsed = defaultVal;
  try {
    parsed = JSON.parse(s);
  } catch (e) {
    console.error('Parsing error on', s);
  }
  return parsed;
}
