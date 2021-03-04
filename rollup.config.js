/* global process */

import createConfig from './rollup-tools/base-config';
import { serve } from './rollup-tools/config-tools';

// Inspired by https://github.com/Tom-Siegel/multi-page-svelte/blob/5dd47f9ffe3cbddbaa5e29be5056ce1ed56060b2/rollup-pages.config.js#L45
var configs = [
  {
    input: 'main.ts',
    outputFile: 'public/build/bundle.js',
    reloadPath: 'public',
    serve: !process.env.APP && serve
  },
  {
    input: 'vats/wily/wily-vat.ts',
    outputFile: 'vats/wily/wily-vat-bundle.js',
    reloadPath: 'vats/wily',
    serve: process.env.APP === 'wily' && serve,
    serveOpts: { rootDir: '.', serveDir: 'vats/wily' }
  },
  {
    input: 'vats/stores/stores-test-app.ts',
    outputFile: 'vats/stores/stores-test-bundle.js',
    reloadPath: 'vats/stores',
    serve: process.env.APP === 'stores' && serve,
    serveOpts: { rootDir: '.', serveDir: 'vats/stores' }
  },
  {
    input: 'vats/groups/groups-vat-app.ts',
    outputFile: 'vats/groups/groups-vat-bundle.js',
    reloadPath: 'vats/groups',
    serve: process.env.APP === 'groups' && serve,
    serveOpts: { rootDir: '.', serveDir: 'vats/groups' }
  }
].map(createConfig);

export default configs;
