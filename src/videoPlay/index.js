import React, {Component} from 'react';
import EmbedVideo from '../common/commonComponent/EmbedVideo';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import './index.css';

class videoPlay extends Component {
    constructor() {
        super();

        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        window.history.go(-1);
    }

    componentDidMount(){
        //event lister
        let videos = document.getElementsByClassName('video-react-video');
        if(videos && videos.length){
            videos[0].addEventListener('play', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });

            videos[0].addEventListener('pause', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });

            videos[0].addEventListener('ended', function(){
                if(document.getElementById('icon-play-video')){
                    document.getElementById('icon-play-video').style.display = 'none';
                }
            });
        }
    }

    render() {
        return (
            <div className="video-play">
                <HeaderWithBack goBack={this.goBack}/>
                <div className="video">
                    <EmbedVideo sources={['//cdn-corner.resource.buzzbuzzenglish.com/interviewcollection....mp4']}
                                poster={'//resource.buzzbuzzenglish.com/image/buzz-corner/banner-inland.png'} />
                    <div className="video-btn" id="icon-play-video">
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_play.png" alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}

export default videoPlay;