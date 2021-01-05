/* global process */

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { serve } from '../config-tools';

const production = !process.env.ROLLUP_WATCH;
const unminify = process.env.UNMINIFY;

export default {
  input: 'card-render-test-app.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'card-render-test-build.js'
  },
  plugins: [
    svelte(),
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),

    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    !production && livereload('.'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && !unminify && terser(),

    json()
  ],
  watch: {
    clearScreen: false,
    include: ['../**', '../public/app.css']
  }
};
