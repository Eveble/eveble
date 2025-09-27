const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const tsPlugin = require('rollup-plugin-typescript2');
const json = require('@rollup/plugin-json');
const fs = require('fs');
const path = require('path');
const { move } = require("fs-extra");

const env = process.env.NODE_ENV;
const pkg = require('./package.json');
let isMVCalled = false;

function moveFile(source, destination) {
  fs.rename(source, destination, err => {
    if (err) {
      console.error(`Error moving file: ${err}`);
    } else {
      console.log(`Moved file: ${source} -> ${destination}`);
    }
  });
}

function moveFiles(sourcePath, destinationPath) {
  // Read the files in the source folder
  fs.readdir(sourcePath, (err, files) => {
    if (err) {
      console.error(`Error reading source folder: ${err}`);
      return;
    }

    // Loop through each file in the source folder
    files.forEach(file => {
      const sourceFilePath = path.join(sourcePath, file);
      const destinationFilePath = path.join(destinationPath, file);

      // Check if the file already exists in the destination folder
      fs.stat(destinationFilePath, (err, stats) => {
        if (!err || (err && err.code !== 'ENOENT')) {
          // A file with the same name already exists in the destination folder
          // Delete the existing file to overwrite it
          fs.unlink(destinationFilePath, err => {
            if (err) {
              console.error(`Error deleting file: ${destinationFilePath}`);
              return;
            }
            // Move the file to the destination folder
            moveFile(sourceFilePath, destinationFilePath);
          });
        } else {
          // No existing file, simply move the file to the destination folder
          moveFile(sourceFilePath, destinationFilePath);
        }
      });
    });
  });
}

const mv = (
  sourcePath,
  destinationPath,
  { once } = {}
) => {
  return {
    name: "mv",
    writeBundle: async () => {
      if (isMVCalled === true && once === true) return;
      isMVCalled = true;
      await moveFiles(sourcePath, destinationPath);
    },
  };
};

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
    nodeResolve({preferBuiltins: true}),
    nodeResolve(),
    json(),
    commonjs(),
    tsPlugin({
      typescript: require('ts-patch/compiler'),
      tsconfigOverride: {
        compilerOptions: {
          experimentalDecorators: true,
          plugins: [
            {
              transform: "tsruntime/dist/transform/transformer.js",
              type: "program"
            }
          ]
        }
      }
    }),
    mv("./dist/src/", "./dist/", {
      once: true,
    }),
  ],
};
