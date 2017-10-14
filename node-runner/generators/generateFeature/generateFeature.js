process.stdin.resume();
process.stdin.setEncoding('utf8');

const util = require('util');
const path = require('path');
const fs = require('fs');

console.log('Welcome to feature create wizard');
console.log('To stop process and quit just write - exit and press enter');
console.log('===========================================================');
console.log('Please enter feature name (should start with capital letter):');

const formatFile = (file, name) => {
  return file
    .replace(new RegExp('_PLACEHOLDER_', 'g'), name)
    .replace(new RegExp('_PLACEHOLDERLOWER_', 'g'), name.toLowerCase());
}

const createMainFile = (pathToFeature, name) => {
  const file = fs.readFileSync(path.join(__dirname, '/templates/feature.template.js'), "utf8");

  fs.appendFileSync(path.join(pathToFeature + `/${name}.ts`), formatFile(file, name));
  fs.appendFileSync(path.join(pathToFeature,  'index.ts'), "export { IUser, IUserModel } from './User.model';\nexport { default } from './User';\n");
}

const createModelFile = (pathToFeature, name) => {
  const fileModel = fs.readFileSync(path.join(__dirname, '/templates/featureModel.template.js'), "utf8");

  fs.appendFileSync(path.join(pathToFeature + `/${name}.model.ts`), formatFile(fileModel, name));
}

const createTestsFiles = (pathToFeature, name) => {
  const fileModel = fs.readFileSync(path.join(__dirname, '/templates/feature.spec.template.js'), "utf8");
  const fileDriverModel = fs.readFileSync(path.join(__dirname, '/templates/feature.driver.template.js'), "utf8");

  fs.appendFileSync(pathToFeature + `/__test__/${name}.spec.ts`, formatFile(fileModel, name));
  fs.appendFileSync(pathToFeature + `/__test__/${name}.driver.ts`, formatFile(fileDriverModel, name));
}

const next = (rawName) => {
  const name = rawName.trim();
  console.log('We starting to create feature');
  const pathToFeature = path.join(__dirname, '../../../src/features', name);

  if (fs.existsSync(pathToFeature)) {
    console.log('Feature with such name already exist, pls try again');
    process.exit(0);
  } else {
    fs.mkdirSync(pathToFeature);
    fs.mkdirSync(pathToFeature + '/__test__');
    console.log('=============');
    console.log('We just created folder');

    createMainFile(pathToFeature, name);
    createModelFile(pathToFeature, name);
    createTestsFiles(pathToFeature, name);

    console.log('=============');
    console.log('We created all files');

    process.exit(0);
  }
}

process.stdin.on('data', (name) => {
  console.log('Name of feature is - ', name);
  if (name === 'exit') {
    console.log('Program closed');
    process.exit(0);
  }
  if (name.match(new RegExp(/^[A-Z]/)) !== null) {
    console.log('This is valid name');
    next(name)
  } else {
    console.log('This is invalid name, try again');
  }
});
