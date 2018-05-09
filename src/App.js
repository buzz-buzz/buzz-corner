import React, {Component} from 'react';

import LoginEntryPoint from './login-entry-point/index';
import LoginEntryPointTablet from './login-entry-point/tablet';
import SelectRole from './select-role/index';
import SelectRoleTablet from './select-role/tablet';
import {browserHistory, Route, Router} from "react-router";
import LoginByFacebook from './login/facebook';
import LoginByWechat from './login/wechat';
import WechatOAuthSuccess from './login/wechat-oauth-success';
import WechatOAuthRedirect from './login/wechat-oauth-redirect';
import UserShow from './user/profileShow';
import UserUpdate from './user/profileUpdate';
import My from './my';
import ClassDetail from './classDetail/index';
import Placement from './placementTest';
import ClassEvaluation from './classEvaluation';
import ClassLessons from './classLessons';
import ClassEvaluationForeign from './classEvaluationForeign';
import Consult from './consult';
import Home from './home/StudentHome';
import Friends from './friends';
import Reward from './reward';
import User from './user';
import Booking from './booking';
import VideoPlay from './videoPlay';
import VideoPlayTablet from './videoPlay/tablet';

import WechatOAuthFail from "./login/wechat-oauth-fail";
import UnderConstruction from "./common/commonComponent/under-construction/index";
import EntryPoint from "./home/EntryPoint";
import SignOut from "./login/sign-out";

const width = window.screen.width;
const height = window.screen.height;
const client = Math.min(width, height) >= 600 ? 'tablet' : 'phone';

class App extends Component {
    render() {
        return (
            <div className="content" style={{height: '100%'}}>
                <style>{`
                    .content > div {height: 100%;}
                `}</style>
                <Router history={browserHistory} style={{height: '100%'}}>
                    <Route path='/' component={EntryPoint}/>
                    <Route path='/select-role' component={ client === 'phone' ? SelectRole : SelectRoleTablet}/>
                    <Route path='/sign-in' component={  client === 'phone' ? LoginEntryPoint : LoginEntryPointTablet}/>
                    <Route path='/sign-out' component={SignOut}/>
                    <Route path="/login/facebook" component={LoginByFacebook}/>
                    <Route path="/login/wechat" component={LoginByWechat}/>
                    <Route path="/wechat/oauth/redirect/:base64_callback_origin/:base64_query_string"
                           component={WechatOAuthRedirect}/>
                    <Route path="/wechat/oauth/success/:wechatUserInfo" component={WechatOAuthSuccess}/>
                    <Route path="/wechat/oauth/fail/:wechatErrorInfo" component={WechatOAuthFail}/>
                    <Route path='/my/info' component={My}/>
                    <Route path='/placement' component={Placement}/>
                    <Route path='/home' component={Home}/>
                    <Route path='/friends' component={Friends}/>
                    <Route path='/reward' component={Reward}/>
                    <Route path='/user' component={User}/>
                    <Route path='/user-profile' component={UserUpdate}/>
                    <Route path='/user/:user_id' component={UserShow}/>
                    <Route path='/class/:class_id' component={ClassDetail}/>
                    <Route path='/consult' component={Consult}/>
                    <Route path='/class/evaluation/:to_user_id/:class_id' component={ClassEvaluation}/>
                    <Route path='/class/foreign/:class_id' component={ClassEvaluationForeign}/>
                    <Route path='/class-lessons' component={ClassLessons}/>
                    <Route path='/under-construction' component={UnderConstruction}/>
                    <Route path='/booking' component={Booking}/>
                    <Route path='/video-play' component={ client === 'phone' ? VideoPlay : VideoPlayTablet}/>
                </Router>
            </div>
        );
    }
}

export default App;
