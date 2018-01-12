import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import {browserHistory, Route, Router} from 'react-router';
import WechatLogin from "./WechatLogin";
import ProfileSetup from "./profileSetup";

ReactDOM.render(<Router history={browserHistory}>
    <Route path="/" component={App}/>
    {/*<Route path="/wechat-login" component={WechatLogin}/>*/}
    <Route path="/profile" component={ProfileSetup}/>
</Router>, document.getElementById('root'));
registerServiceWorker();
