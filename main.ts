var container = {};
export default container;

import { assembleCardsMachine } from './machines/cards-machine';
import { RenderPortControls } from './renderers/import-export-renderers';
import {
  exportFromLocalStorage,
  importToLocalStorage,
} from './persisters/import-export';

assembleCardsMachine();

var renderPortControls = RenderPortControls(
  '.port-controls',
  exportFromLocalStorage,
  importToLocalStorage
);
renderPortControls();
