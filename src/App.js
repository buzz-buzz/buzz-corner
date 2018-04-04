import React, {Component} from 'react';

import ProfilePage from './my/profileSetup';
import WechatLogin from './login-entry-point/index';
import SelectRole from './select-role/index';
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
import ClassEvaluation from './classEvaluation';
import ClassLessons from './classLessons';
import ClassEvaluationForeign from './classEvaluationForeign';
import VideoPlay from './videoPlay';
import Consult from './consult';
import Home from './home/StudentHome';
import Friends from './friends';
import Reward from './reward';
import User from './user';
import Booking from './booking';

import {Container} from "semantic-ui-react";
import WechatOAuthFail from "./login/wechat-oauth-fail";
import UnderConstruction from "./common/commonComponent/under-construction/index";
import EntryPoint from "./home/EntryPoint";

class App extends Component {
    render() {
        return (
            <Container style={{height: '100%'}}>
                <div className="content" style={{height: '100%'}}>
                    <Router history={browserHistory}>
                        <Route path='/' component={EntryPoint}/>
                        <Route path='/select-role' component={SelectRole}/>
                        <Route path='/sign-in' component={WechatLogin}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/login/facebook" component={LoginByFacebook}/>
                        <Route path="/login/wechat/:return_url" component={LoginByWechat}/>
                        <Route path="/wechat/oauth/redirect/:base64_callback_origin/:base64_query_string"
                               component={WechatOAuthRedirect}/>
                        <Route path="/wechat/oauth/success/:wechatUserInfo" component={WechatOAuthSuccess}/>
                        <Route path="/wechat/oauth/fail/:wechatErrorInfo" component={WechatOAuthFail}/>
                        <Route path='/my/info' component={My}/>
                        <Route path='/my/profile' component={ProfilePage}/>
                        <Route path='/my/profile/avatar' component={Avatar}/>
                        <Route path='/my/profile/language' component={Language}/>
                        <Route path='/admin' component={Admin}/>
                        <Route path='/admin/class' component={ClassManage}/>
                        <Route path='/placement' component={Placement}/>
                        <Route path='/home' component={Home}/>
                        <Route path='/friends' component={Friends}/>
                        <Route path='/reward' component={Reward}/>
                        <Route path='/user' component={User}/>
                        <Route path='/class/:class_id' component={ClassDetail}/>
                        <Route path='/consult' component={Consult}/>
                        <Route path='/class/evaluation/:to_user_id/:class_id' component={ClassEvaluation}/>
                        <Route path='/class/foreign/:class_id' component={ClassEvaluationForeign}/>
                        <Route path='/class-lessons' component={ClassLessons}/>
                        <Route path='/video-play' component={VideoPlay}/>
                        <Route path='/under-construction' component={UnderConstruction}/>
                        <Route path='/booking' component={Booking}/>
                    </Router>
                </div>
            </Container>
        );
    }
}

export default App;
