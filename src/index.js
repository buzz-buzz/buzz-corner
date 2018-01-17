import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import {browserHistory, Route, Router} from 'react-router';

import App from './App';
import ProfileSetup from "./profileSetup";
import Header from "./layout/header";
import Footer from "./layout/footer";

ReactDOM.render(
    <div>
        <Header />
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/profile" component={ProfileSetup}/>
    </Router>
        <Footer />
    </div>
    , document.getElementById('root'));
registerServiceWorker();
