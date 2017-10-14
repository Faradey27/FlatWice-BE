const shell = require('shelljs');
const path = require('path');

const imagesPath = path.join(__dirname, '../../src/public/images');
const distPath = path.join(__dirname, '../../dist/public/');

shell.cp('-R', imagesPath, distPath);
