import * as React from "react";
import { Dimmer, Divider, Header, Icon, Image, Segment } from "semantic-ui-react";
import Resources from '../resources';
import './chat.css';
import WechatAudio from "../wechat/audio";
import TabletAudio from "../wechat/tabletAudio";
import Track from "../common/track";
import MessageModal from '../common/commonComponent/modalMessage';
import CurrentUser from "../membership/user";
import Client from "../common/client";

export default class Practice extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            replies: [{
                recordAudio: /MicroMessenger/.test(navigator.userAgent) ? new WechatAudio() : new TabletAudio()
            }],
            soundPlaying: '//cdn-corner.resource.buzzbuzzenglish.com/icon_recording.gif',
            currentReplying: 0,
            currentPlaying: -1,
            repliesPlaying: -1,
            support:  /MicroMessenger/.test(navigator.userAgent) ? true : navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder
        };

        this.audios = {};

        this.renderChat = this.renderChat.bind(this);
        this.play = this.play.bind(this);
        this.endReply = this.endReply.bind(this);
        this.replyButtonClicked = this.replyButtonClicked.bind(this);
        this.reReplyButtonClicked = this.reReplyButtonClicked.bind(this);
        this.cancelReply = this.cancelReply.bind(this);
    }

    async reReplyButtonClicked(buttonIndex = this.state.replies.length - 1) {
        Track.event(this.props.audioUpload ? '测试_点击音频重新录制' : '课程详情_点击音频重新录制');

        this.setState({ recording: true, currentReplying: buttonIndex, recordingStartTime: new Date().getTime() }, () => {
            this.props.recordingChanged(this.state.recording);
        });
        await this.state.replies[buttonIndex].recordAudio.startRecording();
    }

    async replyButtonClicked(buttonIndex = this.state.replies.length - 1) {
        if (this.state.support) {
            Track.event(this.props.audioUpload ? '测试_点击音频录制' : '课程详情_点击音频录制');

            if (this.state.loadingAudio) {
                alert(Resources.getInstance().audioDisabled);
                return;
            }

            this.setState({ currentReplying: buttonIndex });

            if (!this.state.replies[buttonIndex].answered) {
                this.setState({ recording: true, recordingStartTime: new Date().getTime() }, () => {
                    this.props.recordingChanged(this.state.recording);
                });
                await this.state.replies[buttonIndex].recordAudio.startRecording();
            } else {
                this.state.replies[buttonIndex].recordAudio.play();
                //is playing && and the ended event
                this.setState({ repliesPlaying: buttonIndex });
                window.setTimeout(() => {
                    this.setState({ repliesPlaying: -1 });
                }, this.state.recordingEndTime - this.state.recordingStartTime)
            }
        }
    }

    async endReply() {
        if (!this.state.recording) {
            return;
        }

        this.setState({ recording: false, recordingEndTime: new Date().getTime() }, () => {
            this.props.recordingChanged(this.state.recording);
        })

        if (this.state.currentReplying < this.state.replies.length - 1) {
            await this.state.replies[this.state.currentReplying].recordAudio.stopRecording();
            return;
        }

        if (this.props.audioUpload) {
            try {
                let url = await this.state.replies[this.state.replies.length - 1].recordAudio.stopRecordingWithQiniuLink();

                this.props.handleUploadUrl({
                    url: url,
                    err: '',
                    type: 'end'
                });
            }
            catch (ex) {
                this.props.handleUploadUrl({
                    url: '',
                    err: ex.toString(),
                    type: 'end'
                });
            }

        } else {

            await this.state.replies[this.state.currentReplying].recordAudio.stopRecording()

            // 等待 2 秒，形成一种对方正在回复的感觉
            this.setState({
                replying: true
            }, () => {
                window.scrollTo(0, document.documentElement.clientHeight);
            });
            await new Promise(resolve => window.setTimeout(resolve, 2000));
            this.setState({
                replying: false
            }, () => {
                window.scrollTo(0, document.documentElement.clientHeight);
            })
        }

        let replies = this.state.replies;
        replies[this.state.currentReplying].text = 'replying';
        replies[this.state.currentReplying].answered = true;

        if (this.props.chats.length > this.state.replies.length) {
            replies.push({
                recordAudio: /MicroMessenger/.test(navigator.userAgent) ? new WechatAudio() : new TabletAudio()
            });
        }

        this.setState({ replies }, () => {
            window.scrollTo(0, document.documentElement.clientHeight);
        });
    }

    async cancelReply() {
        this.setState({ recording: false }, () => {
            this.props.recordingChanged(this.state.recording);
        });
        await this.state.replies[this.state.replies.length - 1].recordAudio.stopRecording();

        if (this.props.audioUpload) {
            this.props.handleUploadUrl({
                url: '',
                err: '',
                type: 'cancel'
            });
        }
    }

    async play(index) {
        Track.event(this.props.audioUpload ? '测试_点击音频收听' : '课程详情_点击音频收听');

        if (this.audios[index]) {
            try {
                await this.audios[index].play()
                this.setState({ currentPlaying: index });
            } catch (ex) {
                alert(ex);
            }
        }
    }

    async componentDidMount() {
        let audioReady = false;

        if (/MicroMessenger/.test(navigator.userAgent)) {
            try {
                await WechatAudio.init();
                audioReady = true;
            } catch (ex) {
                audioReady = false;
            }
        } else {
            if(this.state.support){
                TabletAudio.init((readyStatus) => {
                    audioReady = readyStatus
                    this.setState({ loadingAudio: !readyStatus })
                });
            }else{
                audioReady = false;
            }
        }

        let userInfo = await CurrentUser.getProfile();
        this.setState({
            avatar: userInfo.avatar,
            loadingAudio: !audioReady
        })
    }

    componentWillUnmount() {
        //stop playing record
        if (this.audios && this.audios.length) {
            for (let i in this.audios) {
                if (this.audios[i]) {
                    this.audios[i].pause();
                }
            }
        }

        this.setState({
            loadingAudio: false
        })
    }

    render() {
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android

        return (
            this.props.chats.length ?
                <Dimmer.Dimmable as={Segment} className="basic" dimmed={this.state.recording}>
                    <Divider horizontal></Divider>
                    <MessageModal modalName="error" modalContent="抱歉，你的浏览器不支持录音功能，请使用最新版Chrome浏览器/Firefox浏览器, 或在微信客户端中体验。"
                        modalShow={!this.state.support} style={{top: '0'}} />
                    <div>
                        {
                            this.state.replies.map((r, i) => {
                                return (
                                    <div key={i}>
                                        <div className="practise-advisor chat message">
                                            <div>
                                                <Image avatar
                                                    src={this.props.avatars[0] || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                                                    alt="avatar" />
                                            </div>
                                            <div
                                                className="advisor-word talk-bubble tri-right left-bottom border round">
                                                {
                                                    isAndroid ?
                                                        <div className="talktext"
                                                            onMouseDown={() => this.play(i)}>
                                                            {
                                                                this.renderAudio(i)
                                                            }
                                                        </div>
                                                        :
                                                        Client.showComponent(<div className="talktext"
                                                            onTouchStart={() => this.play(i)}>
                                                            {
                                                                this.renderAudio(i)
                                                            }
                                                        </div>,
                                                            <div className="talktext"
                                                                onClick={() => this.play(i)}>
                                                                {
                                                                    this.renderAudio(i)
                                                                }
                                                            </div>)

                                                }
                                            </div>
                                        </div>
                                        <div className="practise-student chat message reverse">
                                            <div>
                                                <Image avatar
                                                    src={this.state.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                                                    alt="avatar" />
                                            </div>
                                            <div onClick={() => this.replyButtonClicked(i)} disabled={this.state.loadingAudio}
                                                className="student-word talk-bubble tri-left right-bottom border round">
                                                <div className="talktext">
                                                    <p style={{ paddingLeft: '10px', display: 'flex', alignItems: 'center' }}>
                                                        {
                                                            this.state.loadingAudio ?
                                                                <Icon loading name="spinner" /> :
                                                                <img className="rotate180" style={{ height: '15px' }}
                                                                    src={this.state.repliesPlaying === i ? this.state.soundPlaying : "//cdn-corner.resource.buzzbuzzenglish.com/icon_recording_new.png"}
                                                                    alt="" />
                                                        }
                                                        <span>
                                                            {
                                                                this.state.replies[i].answered ?
                                                                    Resources.getInstance().placementListeningAudio :
                                                                    (
                                                                        this.state.loadingAudio ?
                                                                            '' :
                                                                            Resources.getInstance().placementRecordAudio
                                                                    )
                                                            }
                                                        </span>
                                                    </p>
                                                </div>

                                                {
                                                    i === this.state.replies.length - 1 &&
                                                    <p className="tip">&nbsp;&nbsp;</p>
                                                }
                                            </div>
                                            {   this.props.openPractiseWord &&
                                                <div className="practise-word" onClick= {event => this.props.openPractiseWord(event, i)}>
                                                提示
                                                </div>
                                            }
                                        </div>
                                        {
                                            this.state.replies[i].answered &&

                                            <div onClick={() => this.reReplyButtonClicked(i)} disabled={this.state.loadingAudio}
                                                className="recordAgain">{Resources.getInstance().practiceAgain}</div>
                                        }
                                    </div>
                                );
                            }
                            )
                        }


                        {
                            this.state.replying && this.props.chats.length > this.state.replies.length && this.state.currentReplying === (this.state.replies.length - 1) &&

                            < div className="practise-advisor chat message">
                                <div>
                                    <Image avatar
                                        src={this.props.avatars[0] || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                                        alt="avatar" />
                                </div>
                                <div
                                    className="advisor-word talk-bubble tri-right left-bottom border round">
                                    <div className="talktext" style={{ padding: '0' }}>
                                        <embed
                                            src="//cdn-corner.resource.buzzbuzzenglish.com/icon_information%20cue.svg"
                                            width="80"
                                            height="33"
                                            type="image/svg+xml"
                                            pluginspage="http://www.adobe.com/svg/viewer/install/" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <Divider horizontal />
                    <Dimmer active={this.state.recording} onClickOutside={this.cancelReply} inverted>
                        <Header as='h2' icon inverted>
                            <Icon name="unmute" />
                            Recording!
                        </Header>
                    </Dimmer>
                </Dimmer.Dimmable>
                : ''
        )
    }

    renderAudio(i) {
        let chat = this.props.chats[i].replace('｜', '|'),
            chat_url = '',
            chat_word = '';

        if (chat.indexOf('|') > -1 && chat.split('|').length >= 2) {
            chat_url = chat.split('|')[0];
            chat_word = chat.split('|')[1];
        } else {
            chat_url = chat;
        }

        return this.props.chats &&
            (chat_url.indexOf('http') > -1 || chat_url.indexOf('//') > -1) ?
            (<p style={{display: 'flex'}}>
                {chat_word || Resources.getInstance().placementListeningAudio}
                {this.renderChat(chat_url ? chat_url : null, i)}
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 3px 2px 0'}}>
                    <img style={{ height: '15px', verticalAlign: 'sub'}}
                         src={this.state.currentPlaying === i ? this.state.soundPlaying: "//cdn-corner.resource.buzzbuzzenglish.com/icon_recording_new.png"}
                         alt="" />
                </div>
            </p>) :
            (
                <p>
                    {this.renderChat(chat_url ? chat_url : null, i)}
                </p>
            );
    }

    renderChat(chat, index) {
        if (chat) {
            if (chat.startsWith('http') || chat.startsWith('//')) {
                return <audio type="audio/mpeg" src={chat} ref={(audio) => {
                    this.audios[index] = audio;

                    if (audio) {
                        audio.addEventListener('ended', () => {
                            this.setState({ currentPlaying: -1 });
                        });
                    }
                }}>
                    <source src={chat} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>

            } else {
                return chat;
            }
        } else {
            return '';
        }
    }
}