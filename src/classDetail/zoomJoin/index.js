import React from 'react';
import Track from "../../common/track";
import HeaderWithLogo from '../../common/commonComponent/headerWithLogo';
import './index.css';

export default class ZoomDownJoin extends React.Component {
    componentWillMount() {
        const ua_info = require("ua_parser").userAgent(window.navigator.userAgent);

        if (!/MicroMessenger/.test(navigator.userAgent)) {
            Track.event('课程详情_进入教室唤醒Zoom客户端');

            //TODO 发送请求-保存用户进入教室的时间，记录考勤状况

            if (ua_info && ua_info.platform === 'pc') {
                window.location.href = `zoommtg://zoom.us/join?confno=${this.props.location.query.zoom_number}&zc=${this.props.location.query.zc}&uname=${this.props.location.query.user_name}`;
            } else {
                window.location.href = `zoomus://zoom.us/join?confno=${this.props.location.query.zoom_number}&zc=${this.props.location.query.zc}&uname=${this.props.location.query.user_name}`;
            }

            setTimeout(function () {
                window.location.href = 'http://www.buzzbuzzenglish.com/2';
            }, 5000);
        }
    }

    render() {
        return <div className="zoom-join">
            <HeaderWithLogo href="/"/>
            {
                /MicroMessenger/.test(navigator.userAgent) &&
                <div className="content">
                    <div className="right-img">
                        <img
                            src="//cdn-corner.resource.buzzbuzzenglish.com/zoom/icon_arrows.svg"
                            alt=""/>
                    </div>
                    <div className="content-info">
                        <div>
                            <div className="word">1：轻触右上方的菜单</div>
                            <div className="shadow"></div>
                        </div>
                        <div>
                            <div className="word">2：点击“在浏览器中打开”，然后您将加入教室</div>
                            <div className="shadow"></div>
                        </div>
                    </div>
                    <div className="content-img">
                        <div className="android">
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/zoom/bg_link_Android.png"
                                alt=""/>
                            <p>Android用户参考上图</p>
                        </div>
                        <div className="line"></div>
                        <div className="ios">
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/zoom/bg_link_ios.png"
                                alt=""/>
                            <p>IOS用户参考上图</p>
                        </div>
                    </div>
                </div>
            }
            {
                !/MicroMessenger/.test(navigator.userAgent) &&
                <div className="content-no-wechat">
                    <div className="buzz-title">
                        <p className="title">加入BuzzBuzz教室</p>
                        <span>点击“提示框”打开链接，即可马上加入教室</span>
                    </div>
                    <div className="buzz-img">
                        <img
                            src="//cdn-corner.resource.buzzbuzzenglish.com/zoom/PC_bg_link.png"
                            alt=""/>
                    </div>
                </div>
            }
        </div>
    }
}
