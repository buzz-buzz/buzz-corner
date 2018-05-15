import React, {Component} from 'react';
import Track from "../common/track";
import {Divider, Form, Grid, Header, Image} from "semantic-ui-react";
import {browserHistory} from "react-router";
import FacebookLogin from "../login/facebook";
import WeChatLogin from "../login/wechat";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './companion.css';
import BuzzRoundButton from "../common/commonComponent/buttons/buzz-round-button";
import Resources from "../resources";
import {MemberTypeChinese} from "../membership/member-type";

class CompanionLoginEntryPoint extends Component {
    constructor() {
        super();

        this.state = {};

        this.signInViaWechat = this.signInViaWechat.bind(this);
        this.signInViaFacebook = this.signInViaFacebook.bind(this);
    }

    signInViaWechat() {
        Track.event('登录页面_点击微信登录按钮', null, {
            '用户类型': MemberTypeChinese.Companion
        });
        WeChatLogin.redirectToWechatOAuthPage();
    }

    signInViaFacebook() {
        Track.event('登录页面_点击 Facebook 按钮');

        browserHistory.push(`/login/facebook${window.location.search}`);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div style={{height: '100%'}}>
                <Grid textAlign='center' style={{height: '100%', marginLeft: '0', marginRight: '0'}} verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column style={{padding: '0'}}>
                            <Divider horizontal/>
                            <Divider horizontal/>
                            <Header as="h2" color="teal" textAlign="center">
                                <Image src={QiniuDomain + "/logo_full%20name.png"}
                                       alt="Buzzbuzz header logo" size="medium" style={{width: '120px'}}/>
                            </Header>
                            <Divider horizontal/>
                            <div className="ui fluid image banner-companion">
                                <Image src={ QiniuDomain + "/image/jpgpeople-mobile.jpg"}
                                       alt="Buzzbuzz banner" fluid/>
                            </div>
                            <div className="overlay">
                                <div>Make friends, earn cool rewards, learn new languages, be a leader!</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign="top">
                        <Grid.Column verticalAlign="top">
                            <Form size="large">
                                <FacebookLogin/>
                                <Divider horizontal/>
                                <BuzzRoundButton paddingLeft="60px" onClick={this.signInViaWechat}>
                                    <Image src={ QiniuDomain + "/button_WeChat.png"}
                                           alt="Wechat login"/>
                                    {Resources.getInstance('en-US').signInWith('WECHAT')}
                                </BuzzRoundButton>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
            ;
    }
}

export default CompanionLoginEntryPoint;
