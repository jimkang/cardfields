/* global process */

import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;
const unminify = process.env.UNMINIFY;

//console.log('flags', production, unminify);

export default {
  input: 'card-render-test-app.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'card-render-test-build.js'
  },
  plugins: [
    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true
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
    clearScreen: false
  }
};

function serve() {
  let started = false;

  return {
    writeBundle() {
      if (!started) {
        started = true;

        require('child_process').spawn(
          '../node_modules/.bin/sirv',
          ['.', '--host', '0.0.0.0', '--dev'],
          {
            stdio: ['ignore', 'inherit', 'inherit'],
            shell: true
          }
        );
      }
    }
  };
}
