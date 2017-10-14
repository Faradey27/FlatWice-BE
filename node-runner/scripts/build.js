const shell = require('shelljs');
shell.exec('npm run lint && node ./node-runner/scripts/build-ts.js && node ./node-runner/scripts/copy-static-assets.js');
