const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const filesize = require('rollup-plugin-filesize');
const tsPlugin = require('rollup-plugin-typescript2');
const json = require('rollup-plugin-json');
const ttypescript = require('ttypescript');
const sourceMaps = require('rollup-plugin-sourcemaps');

const env = process.env.NODE_ENV;
const pkg = require('./package.json');

module.exports = {
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
