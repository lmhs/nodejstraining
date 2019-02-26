import DirWatcher from './dirwatcher';

export default class Importer {
  constructor() {
    const dirWatcher = new DirWatcher();

    dirWatcher.on('dirwatcher:changed', (message) => {
      console.log(message);
    })

    dirWatcher.watch('./data', 1000);
  }
}