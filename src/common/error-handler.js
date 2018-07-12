import {toastMessage} from "../actions";
import {createStore} from 'redux';
import reducers from '../reducers/index';

const store = createStore(reducers);

const fundebug = require('fundebug-nodejs');
fundebug.apikey = '8c45e06094dda3c9b553e509b0ed7b6f2033f2135f72d98313e61301f123e8eb';

export default class ErrorHandler {
    static notify(type, error) {
        store.dispatch(toastMessage(error.message));
        window.toast && window.toast.show(error.message);
        fundebug.notify(type, error.message, error);
    }
}