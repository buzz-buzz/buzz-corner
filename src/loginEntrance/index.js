import React, {Component} from 'react';
import {Segment} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
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
        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
    }

    chineseChildEntrance() {
        browserHistory.push('/login-for-wechat');
    }

    foreignChildEntrance() {
        window.location.href = 'https://jinshuju.net/f/OrK4p2';
    }

    goVideoPlayPage(){
        browserHistory.push('/video-play');
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'block';

            let userId = await CurrentUser.getUserId();

            if (userId) {
                let profile = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                    }
                }));

                if (document.getElementById('loadingModal')) {
                    document.getElementById('loadingModal').style.display = 'none';
                }

                if (!profile.date_of_birth || !profile.city) {
                    browserHistory.push('/my/info');
                } else {
                    browserHistory.push('/home');
                }
            } else {
                if (document.getElementById('loadingModal')) {
                    document.getElementById('loadingModal').style.display = 'none';
                }
            }
        } catch (ex) {
            //login error
            console.log("loginEntrance:" + ex.toString());

            if (document.getElementById('loadingModal')) {
                document.getElementById('loadingModal').style.display = 'none';
            }
        }
    }

    render() {
        return (
            <div className="login-entrance">
                <Segment loading={true} id='loadingModal' style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 888,
                    display: 'none'
                }}>
                </Segment>
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz Logo"/>
                    </div>
                    <div className="entrance-word">
                        <p>{Resources.getInstance().welcomePageIntroductionLineOne}</p>
                        <p>{Resources.getInstance().welcomePageIntroductionLineTwo}</p>
                        <p>{Resources.getInstance().welcomePageIntroductionLineThr}</p>
                    </div>
                </div>
                <div className="entrance-choose">
                    <div onClick={this.foreignChildEntrance}>
                        <div className="image">
                            <img src="//p579tk2n2.bkt.clouddn.com/icon_girl.png" alt=""/>
                        </div>
                        <div className="choseBtn">{Resources.getInstance().welcomePageForeignChild}</div>
                    </div>
                    <div onClick={this.chineseChildEntrance}>
                        <div className="image">
                            <img src="//p579tk2n2.bkt.clouddn.com/icon_boy.png" alt=""/>
                        </div>
                        <div className="choseBtn">{Resources.getInstance().welcomePageChineseChild}</div>
                    </div>
                </div>
                <div className="preview-video">
                    <p>{Resources.getInstance().welcomePageBtnWord}</p>
                    <div className="preview-video-btn" onClick={this.goVideoPlayPage}>
                        <div className="btn-circle">
                            <img src="//p579tk2n2.bkt.clouddn.com/icon_play.png" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default loginEntrance;