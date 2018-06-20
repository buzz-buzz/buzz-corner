import React from 'react';
import Resources from '../../resources';
import Track from "../../common/track";
import './index.css';

export default class ZoomDownJoin extends React.Component {
    componentWillMount(){
        const ua_info = require("ua_parser").userAgent(window.navigator.userAgent);

        if(!/MicroMessenger/.test(navigator.userAgent)){
            Track.event('课程详情_进入教室唤醒Zoom客户端');

            if(ua_info && ua_info.platform === 'pc'){
                //window.location.href = this.state.class_info.room_url;
                window.location.href = `zoommtg://zoom.us/join?confno=${this.props.location.query.zoom_number}&zc=0&uname=${this.props.location.query.user_name}`;
            }else{
                window.location.href = `zoomus://zoom.us/join?confno=${this.props.location.query.zoom_number}&zc=0&uname=${this.props.location.query.user_name}`;
            }

            setTimeout(function () {
                window.location.href = 'https://zoom.us/download';
            }, 5000);
        }
    }

    render() {
        return <div className="zoom-download">
            <div className="zoom-header">
                <img src="https://ruanshi2.8686c.com/static/90981/image/new/ZoomLogo.png" alt=""/>
            </div>
            <div className="zoom-title">
                {Resources.getInstance().classZoomJoin}
            </div>
            <div className="modal-download">
                {Resources.getInstance().classZoomJoinInfo}
            </div>
        </div>
    }
}