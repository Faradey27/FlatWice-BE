const shell = require('shelljs');
shell.exec('concurrently -k -p \"[{name}]\" -n \"TypeScript,Node\" -c \"cyan.bold,green.bold\" \"node ./node-runner/scripts/watch-ts.js\" \"node ./node-runner/scripts/serve-debug.js\"');
