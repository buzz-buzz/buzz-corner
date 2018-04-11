import React, {Component} from 'react';
import {Embed} from "semantic-ui-react";
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import {browserHistory} from 'react-router';
import './index.css';

class videoPlay extends Component {
    constructor() {
        super();

        this.goBack = this.goBack.bind(this);
        this.playCornerVideo = this.playCornerVideo.bind(this);
    }

    playCornerVideo(){
        document.getElementById('corner-show').play();
    }

    goBack() {
        document.getElementById('corner-show').pause();

        browserHistory.push('/');
    }

    render() {
        return (
            <div className="video-play">
                <HeaderWithBack goBack={this.goBack}/>
                <div className="video">
                    <Embed
                        aspectRatio='16:9'
                        id='125292332'
                        placeholder='//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png'
                        source='//p579tk2n2.bkt.clouddn.com/Buzzbuzz%20vedio2.mp4'
                    />
                    <div className="video-btn" onClick={this.playCornerVideo}></div>
                    <video id="corner-show" src="//p579tk2n2.bkt.clouddn.com/Training%20video_3min.mp4" width="0" height="0">not support</video>
                </div>
                <div className="poster">
                    <img src="//p579tk2n2.bkt.clouddn.com/icon_login_play.png" alt=""/>
                </div>
            </div>
        );
    }
}

export default videoPlay;