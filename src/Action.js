import { EventEmitter } from 'events';

/**
 * @class Action
 * @extends EventEmitter
 */
export default class Action extends EventEmitter{

  /**
   * @param {Object} EVENTS expects an enum of action names
   */
  constructor (EVENTS) {
    super();

    EVENTS = EVENTS || {};

    /** @enum */
    this.EVENTS = EVENTS;

    /** @type {Array<String>} */
    this.eventNames = Object.keys(EVENTS);

    // to avoid max listeners warning
    this.setMaxListeners(100);
  }

}
