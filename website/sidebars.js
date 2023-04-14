const fs = require('fs');
const npmConfig = JSON.parse(fs.readFileSync('../package.json', 'utf8'));
const ConfigGenerator = require('./.eveble/scripts/docs');
const paths = {
  classes: './docs/api/classes',
  interfaces: './docs/api/interfaces',
  guides: './docs/guides',
};
const configGenerator = new ConfigGenerator(npmConfig, paths);
module.exports = configGenerator.generateSidebar();
