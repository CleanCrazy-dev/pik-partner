import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

export default eventEmitter

export const EVENT_DOCUMENTS_RECHECK = 'EVENT_DOCUMENTS_RECHECK';
export const EVENT_DOCUMENTS_REJECT = 'EVENT_DOCUMENTS_REJECT';
export const EVENT_DOCUMENTS_APPROVE = 'EVENT_DOCUMENTS_APPROVE';
