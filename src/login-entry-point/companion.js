import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import URLHelper from "../common/url-helper";
import {Button, Container, Divider, Form, Grid, Header, Icon, Image} from "semantic-ui-react";
import {browserHistory} from "react-router";
import FacebookLogin from "../login/facebook";
import WeChatLogin from "../login/wechat";

class LoginEntryPoint extends Component {
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
            <div>
                <Grid textAlign='center' style={{height: '100%'}} verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h2" color="teal" textAlign="center">
                                <Image src="//p579tk2n2.bkt.clouddn.com/logo_full%20name.png"
                                       alt="Buzzbuzz header logo"/>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Header>
                                <Image src="//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png"
                                       alt="Buzzbuzz banner"/>
                                <p>{Resources.getInstance().loginByWechatIntroduction}</p>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Form size="large">
                                <FacebookLogin/>
                                <Button color="teal" fluid size="large"
                                        onClick={this.signInViaWechat}>{Resources.getInstance().loginByWechatInfo}</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default LoginEntryPoint;
