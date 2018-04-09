import React, {Component} from 'react';
import {Embed} from "semantic-ui-react";
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
                <div className="header-with-go-back">
                    <div className="go-back" onClick={this.goBack}>
                        <div className="arrow-left">
                        </div>
                        <div className="circle-border">
                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""/>
                        </div>
                    </div>
                    <div className="logo">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png" alt="Buzzbuzz"/>
                        </div>
                    </div>
                </div>
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