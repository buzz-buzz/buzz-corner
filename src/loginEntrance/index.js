import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';

class loginEntrance extends Component {
    constructor() {
        super();

        this.state = {};

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);
        this.foreignChildEntrance = this.foreignChildEntrance.bind(this);

    }

    chineseChildEntrance(){
        browserHistory.push('/login-for-wechat');
    }

    foreignChildEntrance(){
        window.location.href = 'https://jinshuju.net/f/OrK4p2';
    }

    async componentDidMount() {
        try {
            let userId = await CurrentUser.getUserId();

            if(userId){
                let profile = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                    }
                }));

                if(!profile.date_of_birth || !profile.location){
                    browserHistory.push('/my/info');
                }else{
                    browserHistory.push('/home');
                }
            }
        } catch (ex) {
            //login error
            console.log("loginEntrance:" +ex.toString());
        }
    }

    render() {
        return (
            <div className="login-entrance">
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                    </div>
                    <div className="entrance-word">
                        <p>赋能同伴，成就更好的自己!</p>
                        <p>结识英语母语国家的少年，</p>
                        <p>开启你的国际交流旅程。</p>
                    </div>
                </div>
                <div className="entrance-choose">
                    <div onClick={this.chineseChildEntrance}>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/Learning%20English.png" alt=""/>
                        <p>中国少年</p>
                    </div>
                    <div onClick={this.foreignChildEntrance}>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/Teach%20English.png" alt=""/>
                        <p>外籍学伴</p>
                    </div>
                </div>
                <div className="preview-video">
                    <p>看其他伙伴是怎样互动的?</p>
                    <div className="preview-video-btn">
                        <Form.Group widths='equal'>
                            <Form.Field control={Button}
                                        content='去围观'/>
                        </Form.Group>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginEntrance;