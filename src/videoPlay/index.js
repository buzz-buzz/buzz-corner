import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import {browserHistory} from 'react-router';
import './index.css';

class videoPlay extends Component {
    constructor() {
        super();

        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        browserHistory.push('/');
    }

    componentDidMount(){
        //event lister
        let videos = document.getElementsByClassName('video-react-video');
        if(videos && videos.length){
            videos[0].addEventListener('play', function(){
                document.getElementById('icon-play-video').style.display = 'none';
            });

            videos[0].addEventListener('pause', function(){
                document.getElementById('icon-play-video').style.display = 'none';
            });

            videos[0].addEventListener('ended', function(){
                document.getElementById('icon-play-video').style.display = 'none';
            });
        }
    }

    render() {
        return (
            <div className="video-play">
                <HeaderWithBack goBack={this.goBack}/>
                <div className="video">
                    <EmbedVideo sources={['//p579tk2n2.bkt.clouddn.com/Training%20video_3min.mp4']}
                                poster={'//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png'} />
                    <div className="video-btn" id="icon-play-video">
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_play.png" alt=""/>
                    </div>
                </div>
                <div className="poster">
                    <img src="//p579tk2n2.bkt.clouddn.com/icon_login_play.png" alt=""/>
                </div>
            </div>
        );
    }
}

export default videoPlay;