import {toastMessage} from "../actions";
import {createStore} from 'redux';
import reducers from '../reducers/index';

const store = createStore(reducers);

const fundebug = require('../common/logger').fundebug;

export default class ErrorHandler {
    static notify(type, error, info) {
        store.dispatch(toastMessage(error.message));
        window.toast && window.toast.show(error.message);
        fundebug.notify(type, error.message, info ? {
            error: error,
            metaData: {info}
        } : error);
    }
}
