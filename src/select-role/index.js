import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import LoadingModal from '../common/commonComponent/loadingModal';
import './index.css';
import CurrentUser from "../membership/user";
import ServiceProxy from "../service-proxy";
import Track from "../common/track";
import {MemberType} from "../membership/member-type";
import {Message} from "semantic-ui-react";

class SelectRole extends Component {
    constructor() {
        super();

        this.state = {};

        this.chineseChildEntrance = this.chineseChildEntrance.bind(this);
        this.foreignChildEntrance = this.foreignChildEntrance.bind(this);
        this.goVideoPlayPage = this.goVideoPlayPage.bind(this);
    }

    async chineseChildEntrance() {
        this.setState({loadingModal: true});
        Track.event('注册/登录', '点击中方');

        let userId = CurrentUser.getUserId();
        try {
            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`,
                    method: 'PUT',
                    json: {
                        role: MemberType.Student
                    }
                }
            });

            browserHistory.push('/home');
        } catch (error) {
            console.error(error);

            this.setState({error: true, message: JSON.stringify(error.message || error)})
        } finally {
            this.setState({loadingModal: false});
        }
    }

    foreignChildEntrance() {
        Track.event('注册/登录', '点击外籍');
        window.location.href = 'https://jinshuju.net/f/OrK4p2';
    }

    goVideoPlayPage() {
        Track.event('注册/登录', '点击查看案例');
        browserHistory.push('/video-play');
    }

    componentDidMount() {
        Track.event('注册/登录', '欢迎页');
    }

    render() {
        return (
            <div className="login-entrance">
                {
                    this.state.error &&
                    <Message warning>
                        <p>{this.state.message}</p>
                    </Message>
                }
                <LoadingModal loadingModal={this.state.loadingModal}/>
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
                            </div>) :
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

export default SelectRole;