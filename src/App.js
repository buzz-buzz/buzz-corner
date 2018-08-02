import React, {Component} from 'react';
import 'babel-polyfill';
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
import UserUpdate from './user/profileUpdate/user-profile-update';
import My from './my';
import ClassDetail from './classDetail/index';
import Placement from './placementTest';
import ClassEvaluation from './classEvaluation';
import ClassEvaluationResult from './classEvaluationResult';
import ClassEvaluationPoster from './classEvaluationPoster';
import ClassLessons from './classLessons';
import ClassEvaluationForeign from './classEvaluationForeign';
import EvaluationStandards from './classEvaluationResult/evaluationStandards';
import Consult from './consult';
import HelpCenter from './helpCenter';
import Home from './home/Home';
import Friends from './friends';
import Reward from './reward';
import User from './user';
import UserGuide from './helpCenter/userGuide';
import Booking from './booking';
import VideoPlay from './videoPlay';
import VideoPlayTablet from './videoPlay/tablet';
import SetAccount from './account/setAccount';
import AccountAbout from './account/accountAbout';
import LoginByAccount from './accountLogin';
import ZoomDownLoad from './classDetail/zoomDownLoad';
import ZoomJoin from './classDetail/zoomJoin';
import FlexCourses from './flexCourse';

import WechatOAuthFail from "./login/wechat-oauth-fail";
import UnderConstruction
    from "./common/commonComponent/under-construction/index";
import SignOut from "./login/sign-out";
import Client from "./common/client";
import WechatShare from './wechat/wechatShare';
import ToastMessage from './common/commonComponent/modalMessage/toast-message';

WechatShare.init();

class App extends Component {
    render() {
        return (
            <div className="content" style={{height: '100%'}}>
                <style>{`
                    .content > div {height: 100%;}
                `}</style>

                <div style={{height: 'auto'}}>
                    <ToastMessage/>
                </div>
                <Router history={browserHistory} style={{height: '100%'}}>
                    <Route path='/' component={Home}/>
                    <Route path='//' component={Home}/>
                    <Route path='/%2f' component={Home}/>
                    <Route path='/user-info' component={UserUpdate}/>
                    <Route path='/select-role'
                           component={Client.showComponent(SelectRole, SelectRoleTablet)}/>
                    <Route path='/sign-in'
                           component={Client.showComponent(LoginEntryPoint, LoginEntryPointTablet)}/>
                    <Route path='/tutor'
                           component={Client.showComponent(LoginEntryPoint, LoginEntryPointTablet)}/>
                    <Route path='/student'
                           component={Client.showComponent(LoginEntryPoint, LoginEntryPointTablet)}/>
                    <Route path='/sign-out' component={SignOut}/>
                    <Route path="/login/facebook" component={LoginByFacebook}/>
                    <Route path="/login/wechat" component={LoginByWechat}/>
                    <Route
                        path="/wechat/oauth/redirect/:base64_callback_origin/:base64_query_string"
                        component={WechatOAuthRedirect}/>
                    <Route
                        path="/wechat/oauth/qr-redirect/:base64_callback_origin/:base64_query_string"
                        component={WechatOAuthRedirect}/>
                    <Route path="/wechat/oauth/success/:wechatUserInfo"
                           component={WechatOAuthSuccess}/>
                    <Route path="/wechat/oauth/fail/:wechatErrorInfo"
                           component={WechatOAuthFail}/>
                    <Route path='/my/info' component={My}/>
                    <Route path='/my/info/:step' component={My}/>
                    <Route path='/placement' component={Placement}/>
                    <Route path='/home' component={Home}/>
                    <Route path='/friends' component={Friends}/>
                    <Route path='/flex-course' component={FlexCourses}/>
                    <Route path='/reward' component={Reward}/>
                    <Route path='/user' component={User}/>
                    <Route path='/user-profile' component={UserUpdate}/>
                    <Route path='/user-guide' component={UserGuide}/>
                    <Route path='/user/:user_id' component={UserShow}/>
                    <Route path='/account/set' component={SetAccount}/>
                    <Route path='/account/about' component={AccountAbout}/>
                    <Route path='/login/account' component={LoginByAccount}/>
                    <Route path='/class/:class_id' component={ClassDetail}/>
                    <Route path='/consult' component={Consult}/>
                    <Route path='/help/:faq_id' component={HelpCenter}/>
                    <Route path='/class/evaluation/:to_user_id/:class_id'
                           component={ClassEvaluation}/>
                    <Route
                        path='/evaluation/:from_user_id/:to_user_id/:class_id'
                        component={ClassEvaluationResult}/>
                    <Route path='/evaluation/standards'
                           component={EvaluationStandards}/>
                    <Route path='/poster/:from_user_id/:to_user_id/:class_id'
                           component={ClassEvaluationPoster}/>
                    <Route path='/class/foreign/:class_id'
                           component={ClassEvaluationForeign}/>
                    <Route path='/class-lessons' component={ClassLessons}/>
                    <Route path='/under-construction'
                           component={UnderConstruction}/>
                    <Route path='/booking' component={Booking}/>
                    <Route path='/video-play'
                           component={Client.showComponent(VideoPlay, VideoPlayTablet)}/>
                    <Route path='/zoom' component={ZoomDownLoad}/>
                    <Route path='/zoom-join' component={ZoomJoin}/>
                </Router>
            </div>
        )
            ;
    }
}

export default App;
