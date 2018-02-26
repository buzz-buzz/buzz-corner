import React, {Component} from 'react';

import ProfilePage from './my/profileSetup';
import WechatLogin from './loginForWechat/index';
import LoginEntrance from './loginEntrance/index';
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
import ClassDetail from './classDetail/index';
import Placement from './placementTest';
import Consult from './consult';
import Home from './home';
import Friends from './friends';
import Reward from './reward';
import User from './user';

import {Container} from "semantic-ui-react";

class App extends Component {
    render() {
        return (
            <Container style={{height: '100%'}}>
                <div className="content" style={{height: '100%'}}>
                    <Router history={browserHistory}>
                        <Route path='/' component={LoginEntrance}/>
                        <Route path='/login-for-wechat' component={WechatLogin}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/login/facebook" component={LoginByFacebook}/>
                        <Route path="/login/wechat/:return_url?" component={LoginByWechat}/>
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
                        <Route path='/friends' component={Friends} />
                        <Route path='/reward' component={Reward} />
                        <Route path='/user' component={User} />
                        <Route path='/class/:class_id' component={ClassDetail} />
                        <Route path='/consult' component={Consult} />
                    </Router>
                </div>
            </Container>
        );
    }
}

export default App;
