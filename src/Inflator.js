import { EventEmitter } from 'events'

class Inflator extends EventEmitter {

  inflate (data) {
    data = data || Inflator._loadPageData();

    this.emit('reset');
    this.emit('inflate', Inflator.deepClone(data));
  }

  static deepClone (data) {
    data = data || {};
    try {
      return JSON.parse(JSON.stringify(data));
    }
    catch (e) {
      /* what here? */
      return {};
    }
  }

  static _loadPageData () {
    if (typeof document !== 'undefined') {
      try {
        // read all the data from the page
        var data = document.getElementById('page-data');
        return JSON.parse(data.innerHTML);
      } catch (e) {
        console.error(e);
        return {error: e};
      }
    }
  }

}

export default new Inflator();
