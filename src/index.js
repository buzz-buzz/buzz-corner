import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

let fundebug = require('fundebug-javascript');
fundebug.apikey = "88fb903ec9494854c02ec05416ed92da15d15660037ff08dd4ffa50378cf95e4";

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
        if (this.state.hasError) {
            return <h1>出错了！</h1>;
        }

        return this.props.children;
    }
}


ReactDOM.render(<ErrorBoundary><App/></ErrorBoundary>
    , document.getElementById('root'));
registerServiceWorker();
