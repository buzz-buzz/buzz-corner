import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import LoadingModal from '../common/commonComponent/loadingModal';
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
            this.setState({loadingModal: true});

            let userId = await CurrentUser.getUserId();

            if (userId) {
                let profile = (await ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
                    }
                }));

                this.setState({loadingModal: false});

                if (!profile.date_of_birth || !profile.city) {
                    browserHistory.push('/my/info');
                } else {
                    browserHistory.push('/home');
                }
            } else {
                this.setState({loadingModal: false});
            }
        } catch (ex) {
            //login error
            console.log("loginEntrance:" + ex.toString());

            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="login-entrance">
                <LoadingModal loadingModal={this.state.loadingModal} />
                <div className="entrance-logo">
                    <div className="logo">
                        <img src="//p579tk2n2.bkt.clouddn.com/logo_full%20name.png" alt="Buzzbuzz Logo"/>
                    </div>
                    {
                        window.navigator.language === 'zh-CN' ?
                            (<div className="entrance-word">
                                <p>{Resources.getInstance().welcomePageIntroductionLineOne}</p>
                                <p>{Resources.getInstance().welcomePageIntroductionLineTwo}</p>
                                <p>{Resources.getInstance().welcomePageIntroductionLineThr}</p>
                            </div>):
                            (
                                <div className="entrance-word">
                                    <p>{Resources.getInstance().welcomePageIntroductionLineOne + Resources.getInstance().welcomePageIntroductionLineTwo + Resources.getInstance().welcomePageIntroductionLineThr}</p>
                                </div>
                            )
                    }
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