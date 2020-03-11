import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import tsPlugin from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import ttypescript from 'ttypescript';

import sourceMaps from 'rollup-plugin-sourcemaps';

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: {
    file: {
      es: pkg.module,
      cjs: pkg.main,
    }[env],
    format: env,
  },
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    resolve(),
    json(),
    commonjs(),
    filesize(),
    tsPlugin({
      typescript: ttypescript,
    }),
    sourceMaps(),
  ],
};
