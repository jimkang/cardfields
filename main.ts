var container = {};
export default container;

import { assemblePlanesMachine } from './machines/planes-machine';
import { RenderPortControls } from './renderers/import-export-renderers';
import {
  exportFromLocalStorage,
  importToLocalStorage,
} from './persisters/import-export';

assemblePlanesMachine();

var renderPortControls = RenderPortControls(
  '.port-controls',
  exportFromLocalStorage,
  importToLocalStorage
);
renderPortControls();
