import React, {Component} from 'react';

import Header from './layout/header';
import Footer from './layout/footer';
import ProfilePage from './my/profileSetup';
import WechatLogin from './loginForWechat/index';
import {browserHistory, Route, Router} from "react-router";
import Login from "./login/index";
import Avatar from './my/profileSetup/more-info';
import LoginByFacebook from './login/facebook';
import LoginByWechat from './login/wechat';
import WechatOAuthSuccess from './login/wechat-oauth-success';
import WechatOAuthRedirect from './login/wechat-oauth-redirect';
import My from './my';
import Language from './my/myLanguage';
import Admin from './admin/index';
import ClassManage from './admin/classManage';
import Placement from './placementTest';
import Home from './home';

import {Container} from "semantic-ui-react";

class App extends Component {
    render() {
        return (
            <Container style={{height: '100%'}}>
                <div className="content" style={{height: '100%'}}>
                    <Router history={browserHistory}>
                        <Route path='/' component={WechatLogin}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/login/facebook" component={LoginByFacebook}/>
                        <Route path="/login/wechat" component={LoginByWechat}/>
                        <Route path="/wechat/oauth/redirect" component={WechatOAuthRedirect}/>
                        <Route path="/wechat/oauth/success/:wechatUserInfo" component={WechatOAuthSuccess}/>
                        <Route path='/my/info' component={My}/>
                        <Route path='/my/profile' component={ProfilePage}/>
                        <Route path='/my/profile/avatar' component={Avatar}/>
                        <Route path='/my/profile/language' component={Language} />
                        <Route path='/admin' component={Admin} />
                        <Route path='/admin/class' component={ClassManage} />
                        <Route path='/placement' component={Placement} />
                        <Route path='/home' component={Home} />
                    </Router>
                </div>
            </Container>
        );
    }
}

export default App;
