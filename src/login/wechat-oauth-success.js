import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import BuzzServiceApiErrorParser from "../common/buzz-service-api-error-parser";
import { browserHistory } from 'react-router';

export default class WechatOAuthSuccess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatUserInfo: JSON.parse(decodeURIComponent(atob(props.params.wechatUserInfo)))
        };
    }

    async componentDidMount() {
        try {
            await this.loginOldUser(this.state.wechatUserInfo);
        } catch (ex) {
            await this.loginNewUser(ex, this.state.wechatUserInfo);
        }

        //window.location.href = ;window.location.search
        browserHistory.push('/' + window.location.search.split('=')[1]);
    }

    componentWillUnmount() {
    }

    loginOldUser = async (wechatUserInfo) => {
        console.log('try login old user with ', wechatUserInfo);
        let buzzUserData = await this.getBuzzUserData(wechatUserInfo.unionid);
        await this.loginByWechat(wechatUserInfo.unionid, buzzUserData.user_id);
    };

    loginNewUser = async (error, wechatUserData) => {
        if (BuzzServiceApiErrorParser.isNewUser(error)) {
            let newUserId = await this.registerByWechat(wechatUserData);
            await this.loginByWechat(wechatUserData.unionid, newUserId);
        } else {
            throw error;
            alert('Login failed!');
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
                    role: 's',
                    name: wechatUserInfo.nickname,
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

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={true} style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888}}>
                    {JSON.stringify(this.state.userInfo)}
                    <p>return_url = {window.location.search}</p>
                    <p>{decodeURIComponent(this.props.params.return_url)}</p>
                </Segment>
            </Container>
        );
    }
}