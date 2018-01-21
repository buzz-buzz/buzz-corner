import React, {Component} from 'react';

import Header from './layout/header';
import Footer from './layout/footer';
import ProfilePage from './profileSetup';
import HomePage from './layout/homepage';
import {browserHistory, Route, Router} from "react-router";
import Login from "./login/index";
import Avatar from './profileSetup/more-info';
import LoginByFacebook from './login/facebook';
import LoginByWechat from './login/wechat';
import WechatOAuthSuccess from './login/wechat-oauth-success';
import WechatOAuthRedirect from './login/wechat-oauth-redirect';
import {Container} from "semantic-ui-react";

class App extends Component {
    render() {
        return (
            <Container style={{height: '100%'}}>
                <Header/>
                <div className="content">
                    <Router history={browserHistory}>
                        <Route path='/' component={HomePage}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/login/facebook" component={LoginByFacebook}/>
                        <Route path="/login/wechat" component={LoginByWechat}/>
                        <Route path="/wechat/oauth/redirect" component={WechatOAuthRedirect}/>
                        <Route path="/wechat/oauth/success/:wechatUserInfo" component={WechatOAuthSuccess}/>
                        <Route path='/profile' component={ProfilePage}/>
                        <Route path='/profile/avatar' component={Avatar}/>
                    </Router>
                </div>
                <Footer/>
            </Container>
        );
    }
}

export default App;
