const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('\n');

/**
 * Converters interfaces to readable form.
 * @param {string} dir - Dir to interfaces files exported typedoc.
 */
function convert(dir) {
  const fileNames = listFilesInDir(dir, {});
  normalize(dir, fileNames);
}

/**
 * Normalizes `title` and `sidebar_label` for interfaces.
 * @param {string} dir - Dir to interfaces files exported typedoc.
 * @param {string[]} fileNames - List of file names in the directory
 */
function normalize(dir, fileNames) {
  for (const fileName of fileNames) {
    const filePath = `${dir}/${fileName}`;
    let file = fs.readFileSync(filePath, 'utf8');
    const regex = new RegExp(/(\*|↳) \*\*[_a-zA-Z0-9-]+\*\*/);
    const matchStr = file.match(regex);
    if (matchStr === null) {
      continue;
    }
    const name = matchStr[0].replace(/\*|↳/g, '').trim();
    file = file.replace('title: "typend"', `title: "${name}"`);
    file = file.replace('sidebar_label: "README"', `sidebar_label: "${name}"`);
    fs.writeFileSync(filePath, file);
  }
}

/**
 * Returns all files in directory(non-recursive).
 * @param {string} dir - Path to directory.
 * @return {string[]} List of files.
 */
function listFilesInDir(dir) {
  try {
    return fs.readdirSync(dir);
  } catch (e) {
    return [];
  }
}

/**
 * End the setup process.
 */
function endProcess() {
  process.stdout.write(
    '\n\nNormalized interfaces under ./website/docs/api/interfaces!\n'
  );
  process.exit(0);
}

/**
 * @async
 * Run
 */
(async () => {
  convert('./website/docs/api/interfaces');
  endProcess();
})();
