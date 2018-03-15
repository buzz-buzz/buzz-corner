import React, {Component} from 'react';
import {Form, Button, Segment} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import './index.css';

class loginEntrance extends Component {
    constructor() {
        super();

        this.state = {};

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);
        this.foreignChildEntrance = this.foreignChildEntrance.bind(this);
        this.playVideo = this.playVideo.bind(this);
        this.closeVideo = this.closeVideo.bind(this);

    }

    chineseChildEntrance(){
        browserHistory.push('/login-for-wechat');
    }

    foreignChildEntrance(){
        window.location.href = 'https://jinshuju.net/f/OrK4p2';
    }

    playVideo(){
        document.getElementById('video-show').style.display = 'flex';
    }

    closeVideo(){
        document.getElementById('video-corner').pause();

        document.getElementById('video-show').style.display = 'none';
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'block';

            let userId = await CurrentUser.getUserId();

            if(userId){
                let profile = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                    }
                }));

                document.getElementById('loadingModal').style.display = 'none';

                if(!profile.date_of_birth || !profile.city){
                    browserHistory.push('/my/info');
                }else{
                    browserHistory.push('/home');
                }
            }else{
                document.getElementById('loadingModal').style.display = 'none';
            }
        } catch (ex) {
            //login error
            console.log("loginEntrance:" +ex.toString());

            document.getElementById('loadingModal').style.display = 'none';
        }
    }

    render() {
        return (
            <div className="login-entrance">
                <Segment loading={true} id='loadingModal' style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888, display: 'none'}}>
                </Segment>
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                    </div>
                    <div className="entrance-word">
                        <p>{Resources.getInstance().welcomePageIntroductionLineOne}</p>
                        <p>{Resources.getInstance().welcomePageIntroductionLineTwo}</p>
                        <p>{Resources.getInstance().welcomePageIntroductionLineThr}</p>
                    </div>
                </div>
                <div className="entrance-choose">
                    <div onClick={this.chineseChildEntrance}>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/Learning%20English.png" alt=""/>
                        <p>{Resources.getInstance().welcomePageChineseChild}</p>
                    </div>
                    <div onClick={this.foreignChildEntrance}>
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/Teach%20English.png" alt=""/>
                        <p>{Resources.getInstance().welcomePageForeignChild}</p>
                    </div>
                </div>
                <div className="preview-video">
                    <p>{Resources.getInstance().welcomePageBtnWord}</p>
                    <div className="preview-video-btn" onClick={this.playVideo}>
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_suspend_light.png" alt=""/>
                    </div>
                </div>
                <div className="video-show" id="video-show" onClick={this.closeVideo}>
                    <video id="video-corner" src="//p579tk2n2.bkt.clouddn.com/Buzzbuzz%20vedio2.mp4" width="300" height="225" controls>抱歉, 你的浏览器不支持Video标签！</video>
                </div>
            </div>
        );
    }
}

export default loginEntrance;