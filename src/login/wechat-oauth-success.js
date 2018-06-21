import React from 'react';
import ServiceProxy from '../service-proxy';
import CurrentUser from "../membership/user";
import BuzzServiceApiErrorParser from "../common/buzz-service-api-error-parser";
import {browserHistory} from 'react-router';
import LoadingModal from '../common/commonComponent/loadingModal';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";

export default class WechatOAuthSuccess extends React.Component {
    loginOldUser = async (wechatUserInfo) => {
        let buzzUserData = await this.getBuzzUserData(wechatUserInfo.unionid);
        await this.loginByWechat(wechatUserInfo.unionid, buzzUserData.user_id);
    };
    loginNewUser = async (error, wechatUserData) => {
        if (BuzzServiceApiErrorParser.isNewUser(error)) {
            let newUserId = await this.registerByWechat(wechatUserData);
            await this.loginByWechat(wechatUserData.unionid, newUserId);
        } else {
            throw error;
        }
    };
    getBuzzUserData = async (wechatUnionId) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/by-wechat?unionid=${wechatUnionId}`
            }
        });
    };
    registerByWechat = async (wechatUserInfo) => {
        return await ServiceProxy.proxyTo({
            body: {
                uri: '{config.endPoints.buzzService}/api/v1/users',
                method: 'POST',
                json: {
                    role: this.state.role || MemberType.Student,
                    wechat_name: wechatUserInfo.nickname,
                    wechat_openid: wechatUserInfo.openid,
                    wechat_unionid: wechatUserInfo.unionid,
                    avatar: wechatUserInfo.headimgurl,
                    gender: wechatUserInfo.sex === 1 ? 'm' : (wechatUserInfo.sex === 0 ? 'f' : 'u'),
                    language: wechatUserInfo.language.replace('_', '-'),
                    location: wechatUserInfo.country + ' ' + wechatUserInfo.province + ' ' + wechatUserInfo.city
                }
            }
        });
    };
    loginByWechat = async (wechatUnionId, userId) => {
        let res = await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/sign-in`,
                method: 'PUT',
                json: {
                    user_id: userId,
                    wechat_unionid: wechatUnionId
                }
            }
        });

        this.setState({
            userInfo: res,
            loading: false
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatUserInfo: JSON.parse(decodeURIComponent(atob(decodeURIComponent(props.params.wechatUserInfo))))
        };
    }

    async componentWillMount() {
        if (URLHelper.handleOrigin()) {
            return;
        }

        let base64QueryString = this.decodeBase64QueryString();
        this.setState({role: URLHelper.getSearchParam(base64QueryString, 'role')});

        try {
            await this.loginOldUser(this.state.wechatUserInfo);
        } catch (ex) {
            await this.loginNewUser(ex, this.state.wechatUserInfo);
        }

        await this.gotoAfterLoginPage(base64QueryString);
    }

    async gotoAfterLoginPage(base64QueryString) {
        let userId = await CurrentUser.getUserId();

        let profile = (await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        }));

        let returnUrl = URLHelper.getSearchParam(base64QueryString, 'return_url');

        if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name) {
            this.completeProfile(returnUrl);
        } else {
            this.goto(returnUrl);
        }
    }

    decodeBase64QueryString() {
        try {
            let base64QueryString = URLHelper.getSearchParam(window.location.search, 'base64_query_string');
            if (base64QueryString) {
                base64QueryString = atob(base64QueryString);
            }
            return base64QueryString;
        } catch (ex) {
            console.error(ex);
            return '';
        }
    }

    goto(returnUrl) {
        let path = returnUrl || '/home';

        if (!window.parent) {
            browserHistory.push(path);
        } else {
            window.parent.location.href = path;
        }
    }

    completeProfile(returnUrl) {
        let url = `/my/info?return_url=${returnUrl}`;

        if (!window.parent) {
            browserHistory.push(url);
        } else {
            window.parent.location.href = url;
        }
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <LoadingModal loadingModal={true} fullScreen={true}/>
        );
    }
}
