// import {name} from './config/config.json';
// import {User, Product} from './models/';

// console.log(name);
// new User();
// new Product();

import Importer from './importer';
import DirWatcher from './dirwatcher';

const dirWatcher = new DirWatcher();
dirWatcher.watch('./data', 1000);

const importer = new Importer();

function logResult(result) {
  console.log(result);
}

function logError(error) {
  console.log(error);
}

importer.init(dirWatcher, logResult, logError);
