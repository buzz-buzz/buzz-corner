import React from 'react';

export default class ZoomDownJoin extends React.Component {
    constructor(){
        super();

        this.joinZoomPc = this.joinZoomPc.bind(this);
        this.joinZoom = this.joinZoom.bind(this);
        this.joinZoomMobile = this.joinZoomMobile.bind(this);
    }

    joinZoom(){
        const ua_info = require("ua_parser").userAgent(window.navigator.userAgent);

        if(ua_info && ua_info.platform === 'pc'){
            //window.location.href = this.state.class_info.room_url;
            window.location.href = `zoommtg://zoom.us/join?confno=558571102&zc=0&uname=hank`;
        }else{
            window.location.href = `zoomus://zoom.us/join?confno=558571102&zc=0&uname=hank`;
        }
    }

    joinZoomPc(){
        window.location.href = `zoommtg://zoom.us/join?confno=558571102&zc=0&uname=hank`;
    }

    joinZoomMobile(){
        window.location.href = `zoomus://zoom.us/join?confno=558571102&zc=0&uname=hank`;
    }

    render() {
        return <div>
            <br/>
            <button onClick={this.joinZoom}>加入会议</button>
            <br/>
            <button onClick={this.joinZoomPc}>加入会议PC</button>
            <br/>
            <button onClick={this.joinZoomMobile}>加入会议Mobile</button>
            </div>
    }
}