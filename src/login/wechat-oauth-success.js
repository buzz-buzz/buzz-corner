import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import CurrentUser from "../membership/user";
import BuzzServiceApiErrorParser from "../common/buzz-service-api-error-parser";
import {browserHistory} from 'react-router';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";

export default class WechatOAuthSuccess extends React.Component {
    loginOldUser = async (wechatUserInfo) => {
        console.log('try login old user with ', wechatUserInfo);
        let buzzUserData = await this.getBuzzUserData(wechatUserInfo.unionid);
        console.log('trying to login with buzzData:', buzzUserData);
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

        console.log('登录成功！', res);
        this.setState({
            userInfo: res,
            loading: false
        });
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatUserInfo: JSON.parse(decodeURIComponent(atob(props.params.wechatUserInfo)))
        };
    }

    async componentDidMount() {
        this.handleOrigin();

        try {
            await this.loginOldUser(this.state.wechatUserInfo);
        } catch (ex) {
            await this.loginNewUser(ex, this.state.wechatUserInfo);
        }

        //check if profile is Done or not
        //Done go home page, unDone go my/info
        try {
            //await CurrentUser.getUserId();
            let userId = await CurrentUser.getUserId();

            let profile = (await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                }
            }));

            let returnUrl = URLHelper.getSearchParam(window.location.search, 'return_url');

            if (!profile.date_of_birth || (!profile.location && !profile.city)) {
                browserHistory.push(`/my/info?return_url=${returnUrl}`);
            } else {
                browserHistory.push(returnUrl || '/home');
            }
        } catch (ex) {
            console.log('login failed: ' + ex.toString());
        } finally {
            //console.log('login failed');
        }
    }

    handleOrigin() {
        try {
            let callbackOrigin = URLHelper.getSearchParam(window.location.search, 'callback_origin');

            if (callbackOrigin) {
                callbackOrigin = atob(callbackOrigin);
            }

            if (callbackOrigin !== window.location.origin) {
                window.location = callbackOrigin + window.location.pathname + window.location.search;
            } else {
                let base64QueryString = URLHelper.getSearchParam(window.location.search, 'base64_query_string');
                if (base64QueryString) {
                    base64QueryString = atob(base64QueryString);
                }

                let role = URLHelper.getSearchParam(base64QueryString, 'role');
                this.setState({
                    role: role
                });
            }
        } catch (ex) {
            alert(JSON.stringify(ex));
        }
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={true}
                         style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888}}>
                    {JSON.stringify(this.state.userInfo)}
                </Segment>
            </Container>
        );
    }
}
