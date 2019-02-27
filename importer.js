import csv from 'csvtojson';
import {join} from 'path';

export default class Importer {
  init(dirWatcher, resolve, reject) {
    dirWatcher.on('dirwatcher:changed', (result) => {
      this.update(result, resolve, reject)
    });
  }

  update({path, filename, message}, resolve, reject) {
    if (message) {
      console.log(message);
    }

    if (path &&
        filename &&
        typeof resolve === 'function' &&
        typeof reject === 'function') {

      this.import(join(path, filename))
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });

        // this.importSync(join(path, filename));
    }
  }

  getCSVContentsAsync(filePath) {
    return csv()
      .fromFile(filePath);
  }

  import(filePath) {
    return this.getCSVContentsAsync(filePath)
      .then((json) => {
        return new Promise((resolve, reject) => {
          if (json.length === 0) {
            reject('empty object');
          }
          resolve(JSON.stringify(json));
        });
      });
  }

  importSync(filePath) {
    this.getCSVContentsAsync(filePath)
      .then((json) => {
        console.log(JSON.stringify(json));
      }, (error) => {
        console.log(error);
      })
  }
}