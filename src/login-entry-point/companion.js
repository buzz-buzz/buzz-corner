import React, {Component} from 'react';
import Track from "../common/track";
import {Divider, Form, Grid, Header, Image} from "semantic-ui-react";
import {browserHistory} from "react-router";
import FacebookLogin from "../login/facebook";
import WeChatLogin from "../login/wechat";
import './companion.css';
import BuzzRoundButton from "../common/commonComponent/buttons/buzz-round-button";

class CompanionLoginEntryPoint extends Component {
    constructor() {
        super();

        this.state = {};

        this.signInViaWechat = this.signInViaWechat.bind(this);
        this.signInViaFacebook = this.signInViaFacebook.bind(this);
    }

    signInViaWechat() {
        Track.event('登录页面_点击微信登录按钮');
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
                <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column>
                            <Divider horizontal/>
                            <Divider horizontal/>
                            <Header as="h2" color="teal" textAlign="center">
                                <Image src="//p579tk2n2.bkt.clouddn.com/logo_full%20name.png"
                                       alt="Buzzbuzz header logo" size="medium" style={{width: '120px'}}/>
                            </Header>
                            <Divider horizontal/>
                            <div className="ui fluid image banner-companion">
                                <Image src="//p579tk2n2.bkt.clouddn.com/image/jpgpeople-mobile.jpg"
                                       alt="Buzzbuzz banner" fluid/>
                            </div>
                            <div className="overlay">
                                <div>Get an extra job helping students from other countries to speak English</div>
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row verticalAlign="top">
                        <Grid.Column verticalAlign="top">
                            <Form size="large">
                                <FacebookLogin/>
                                <Divider horizontal/>
                                <BuzzRoundButton paddingLeft="60px" onClick={this.signInViaWechat}>
                                    <Image src="//resource.buzzbuzzenglish.com/image/buzz-corner/button_WeChat.png"
                                           alt="Wechat login"/>
                                    SIGN IN WITH <strong>WECHAT</strong>
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
