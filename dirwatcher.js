import EventEmitter from 'events';
import {readdir} from 'fs';

function filterByCSVExtension(filename) {
  return filename.endsWith('.csv');
}

export default class DirWatcher extends EventEmitter {
  constructor() {
    super();
  }

  postError(error) {
    this.emit(`error: ${error}`);
  }

  postMessageChange(message) {
    this.emit('dirwatcher:changed', message);
  }

  postMessageCreated(filename) {
    this.postMessageChange(`${filename} was created`);
  }

  postMessageRemoved(filename) {
    this.postMessageChange(`${filename} was removed`);
  }

  watch(path, delay) {
    console.log(`watching files in ${path}…`);

    readdir(path, (error, files) => {
      if (error) {
        this.postError(error);
        return;
      }

      const prevFilesState = files.filter(filterByCSVExtension);

      for (const filename of prevFilesState) {
        this.postMessageCreated(filename);
      }

      const interval = setInterval(() => {
        readdir(path, (error, files) => {
          const curFilesState = files.filter(filterByCSVExtension);;
          if (error) {
            clearInterval(interval);
            this.postError(error);
            return;
          }

          if (curFilesState.length >= prevFilesState.length) {
            for (const filename of curFilesState) {
              if (!prevFilesState.includes(filename)) {
                prevFilesState.push(filename);
                this.postMessageCreated(filename);
              }
            }
          } else if (prevFilesState.length >= curFilesState.length) {
            for (const filename of prevFilesState) {
              if (!curFilesState.includes(filename)) {
                prevFilesState.splice(prevFilesState.indexOf(filename), 1 );;
                this.postMessageRemoved(filename);
              }
            }
          }
        });
      }, delay);
    });

  }
}