const shell = require('shelljs');
shell.exec('npm run build && node ./node-runner/scripts/watch-debug.js');
