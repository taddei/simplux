import { EventEmitter } from 'events';
import Inflator from './Inflator';

/**
 * @class Store
 * @extends EventEmitter
 */
export default class Store extends EventEmitter {
  /**
   * @param {*=} data The initial data of the store
   */
  constructor (data) {
    super();

    this.UPDATE = 'up';

    // keep a clean copy of the data for the rest
    this._data = data || {};
    this.reset();

    // to avoid max listeners warning
    this.setMaxListeners(100);

    // hook up to the Inflator
    Inflator.on('reset', this.reset.bind(this));
    Inflator.on('inflate', this.inflate.bind(this));

    this.init();
  }

  init () {
    console.error('The current store does not declare the init function.\nDeclare your listeners in the init function', this);
  }

  inflate () {
    console.error('The current store does not declare the inflate function.\nReceive your page data in the inflate function', this);
  }

  reset () {
    this.data = Store.deepClone(this._data);
  }

  done () {
    this.emit(this.UPDATE, this.data);
  }

  onUpdate (cb) {
    this.on(this.UPDATE, cb);
  }

  removeUpdateListener (cb) {
    this.removeListener(this.UPDATE, cb);
  }

  static deepClone (data) {
    return JSON.parse(JSON.stringify(data));
  }
}
