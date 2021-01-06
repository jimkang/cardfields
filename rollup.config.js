/* global process */

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { serve } from './config-tools';
import typescript from '@rollup/plugin-typescript';
//import autoPreprocess from 'svelte-preprocess';
import sveltePreprocess from 'svelte-preprocess';
//import babel from '@rollup/plugin-babel';

const production = !process.env.ROLLUP_WATCH;
const unminify = process.env.UNMINIFY;

//console.log('flags', production, unminify);

export default {
  input: 'main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      // enable run-time checks when not in production
      compilerOptions: { dev: !production }
    }),

    resolve({
      browser: true,
      dedupe: ['svelte']
    }),

    commonjs(),
    json(),
    typescript({
      sourceMap: !production,
      inlineSources: !production
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve({}),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && !unminify && terser()
    //babel({
    //babelHelpers: 'bundled'
    //})
  ],
  watch: {
    clearScreen: false
  }
};
