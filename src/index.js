import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

import {createStore} from 'redux';
import {Provider} from 'react-redux';
import users from './reducers';

let fundebug = require('./common/logger').fundebug;

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});

        fundebug.notifyError(error, {
            metaData: {
                info: info
            }
        })
    }

    render() {
        return this.props.children;
    }
}


const store = createStore(users);
window.store = store;

ReactDOM.render(<ErrorBoundary>
        <Provider store={store}>
            <App/>
        </Provider>
    </ErrorBoundary>
    , document.getElementById('root'));
registerServiceWorker();
