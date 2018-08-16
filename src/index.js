import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

import {Provider} from 'react-redux';
import store from './redux/store';

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
                info: info,
            }
        })
    }

    render() {
        return this.props.children;
    }
}


window.store = store;

ReactDOM.render(<ErrorBoundary>
        <Provider store={store}>
            <App/>
        </Provider>
    </ErrorBoundary>
    , document.getElementById('root'));
registerServiceWorker();
