import React from 'react';
import {Container, Segment} from "semantic-ui-react";
import ServiceProxy from '../service-proxy';
import BuzzServiceApiErrorParser from "../common/buzz-service-api-error-parser";

export default class WechatOAuthSuccess extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            wechatUserInfo: JSON.parse(atob(props.params.wechatUserInfo))
        };
    }

    async componentDidMount() {
        try {
            await this.loginOldUser(this.state.wechatUserInfo);
        } catch (ex) {
            await this.loginNewUser(ex, this.state.wechatUserInfo);
        }
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
    }

    render() {
        return (
            <Container textAlign="center">
                <Segment loading={this.state.loading}>
                    {JSON.stringify(this.state.userInfo)}
                </Segment>
            </Container>
        );
    }
}