const { exec } = require('child_process');

exec('killall mongod', () => {
  setTimeout(() => {
    exec('mongod --fork --logpath ./logs/mongodb.log', () => {
      process.exit(0); // eslint-disable-line
    });
  }, 500);
});
