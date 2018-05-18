import * as React from "react";
import {Dimmer, Divider, Header, Icon, Image, Segment} from "semantic-ui-react";
import Resources from '../resources';
import './chat.css';
import WechatAudio from "../wechat/audio";
import TabletAudio from "../wechat/tabletAudio";
import Track from "../common/track";
import LoadingModal from '../common/commonComponent/loadingModal';
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
            repliesPlaying: -1
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
        this.setState({recording: true, currentReplying: buttonIndex, recordingStartTime: new Date().getTime()}, () => {
            this.props.recordingChanged(this.state.recording);
        });
        await this.state.replies[buttonIndex].recordAudio.startRecording();
    }

    async replyButtonClicked(buttonIndex = this.state.replies.length - 1) {
        Track.event(this.props.audioUpload ? '测试_点击音频录制' : '课程详情_点击音频录制');

        this.setState({currentReplying: buttonIndex});

        if (!this.state.replies[buttonIndex].answered) {
            this.setState({recording: true, recordingStartTime: new Date().getTime()}, () => {
                this.props.recordingChanged(this.state.recording);
            });
            await this.state.replies[buttonIndex].recordAudio.startRecording();
        } else {
            this.state.replies[buttonIndex].recordAudio.play();
            //is playing && and the ended event
            console.log(this.state.recordingEndTime - this.state.recordingStartTime);
            this.setState({repliesPlaying: buttonIndex});
            window.setTimeout(() => {
                this.setState({repliesPlaying: -1});
            }, this.state.recordingEndTime - this.state.recordingStartTime)
        }
    }

    async endReply() {
        if (!this.state.recording) {
            return;
        }

        this.setState({recording: false, recordingEndTime: new Date().getTime()}, () => {
            this.props.recordingChanged(this.state.recording);
        })

        if (this.state.currentReplying < this.state.replies.length - 1) {
            await this.state.replies[this.state.replies.length - 1].recordAudio.stopRecording();
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

            await this.state.replies[this.state.replies.length - 1].recordAudio.stopRecording()

            // 等待 2 秒，形成一种对方正在回复的感觉
            this.setState({
                replying: true
            });
            await new Promise(resolve => window.setTimeout(resolve, 2000));
            this.setState({
                replying: false
            })
        }

        let replies = this.state.replies;
        replies[replies.length - 1].text = 'replying';
        replies[replies.length - 1].answered = true;

        if (this.props.chats.length > this.state.replies.length) {
            replies.push({
                recordAudio: /MicroMessenger/.test(navigator.userAgent) ? new WechatAudio() : new TabletAudio()
            });
        }

        this.setState({replies});
    }

    async cancelReply() {
        this.setState({recording: false}, () => {
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
                this.setState({currentPlaying: index});
            } catch (ex) {
                alert(ex);
            }
        }
    }

    async componentDidMount() {
        let audioReady = false;

        if (/MicroMessenger/.test(navigator.userAgent)) {
            this.setState({loadingModal: true});
            try {
                await WechatAudio.init();
                audioReady = true;
            } catch (ex) {
                audioReady = false;
            }
        }else{
            try {
                audioReady  = await TabletAudio.init();
            } catch (ex) {
                audioReady = false;
            }
        }

        let userInfo = await CurrentUser.getProfile();
        this.setState({
            avatar: userInfo.avatar,
            loadingModal: !audioReady
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
            loadingModal: false
        })
    }

    render() {
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android

        return (
            this.props.chats.length ?
                <Dimmer.Dimmable as={Segment} className="basic" dimmed={this.state.recording}>
                    <Divider horizontal></Divider>
                    <LoadingModal loadingModal={this.state.loadingModal}/>
                    <div>
                        {
                            this.state.replies.map((r, i) => {
                                    return (
                                        <div key={i}>
                                            <div className="practise-advisor chat message">
                                                <div>
                                                    <Image avatar
                                                           src={this.props.avatars[0]}
                                                           alt="avatar"/>
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
                                            <div className="practise-student chat message reverse"
                                                 onClick={() => this.replyButtonClicked(i)}
                                                // onTouchEnd={this.endReply}
                                                //  onTouchMoveCapture={this.reply}
                                            >


                                                <div>
                                                    <Image avatar
                                                           src={this.state.avatar}
                                                           alt="avatar"/>
                                                </div>

                                                <div
                                                    className="student-word talk-bubble tri-left right-bottom border round">
                                                    <div className="talktext">
                                                        <p style={{paddingLeft: '10px'}}>
                                                            <img className="rotate180" style={{height: '15px'}}
                                                                 src={this.state.repliesPlaying === i ? this.state.soundPlaying : "//cdn-corner.resource.buzzbuzzenglish.com/icon_recording_new.png"}
                                                                 alt=""/>
                                                            <span>{this.state.replies[i].answered ? Resources.getInstance().placementListeningAudio : Resources.getInstance().placementRecordAudio}</span>
                                                        </p>
                                                    </div>

                                                    {
                                                        i === this.state.replies.length - 1 &&
                                                        <p className="tip">&nbsp;&nbsp;</p>
                                                    }
                                                </div>

                                            </div>
                                            {
                                                this.state.replies[i].answered &&

                                                <div onClick={() => this.reReplyButtonClicked(i)}
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
                                    <Image avatar src={this.props.avatars[0]} alt="avatar"/>
                                </div>
                                <div
                                    className="advisor-word talk-bubble tri-right left-bottom border round">
                                    <div className="talktext" style={{padding: '0'}}>
                                        <embed src="http://cdn-corner.resource.buzzbuzzenglish.com/icon_information%20cue.svg"
                                               width="80"
                                               height="33"
                                               type="image/svg+xml"
                                               pluginspage="http://www.adobe.com/svg/viewer/install/"/>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <Divider horizontal/>
                    <Dimmer active={this.state.recording} onClickOutside={this.cancelReply} inverted>
                        <Header as='h2' icon inverted>
                            <Icon name="unmute"/>
                            Recording!
                        </Header>
                    </Dimmer>
                </Dimmer.Dimmable>
                : ''
        )
    }

    renderAudio(i) {
        return this.props.chats &&
        (this.props.chats[i].indexOf('http') > -1 || this.props.chats[i].indexOf('//') > -1) ?
            (<p>
                {Resources.getInstance().placementListeningAudio}
                {this.renderChat(this.props.chats ? this.props.chats[i] : null, i)}

                {
                    this.state.currentPlaying === i
                        ? <img style={{height: '15px'}}
                               src={this.state.soundPlaying}
                               alt=""/>
                        : <img
                            src="//cdn-corner.resource.buzzbuzzenglish.com/icon_recording_new.png"
                            style={{height: '15px'}} alt=""/>
                }
            </p>) :
            (
                <p>
                    {this.renderChat(this.props.chats ? this.props.chats[i] : null, i)}
                </p>
            );
    }

    renderChat(chat, index) {
        if (chat) {
            if (chat.startsWith('http') || chat.startsWith('//')) {
                chat = chat.replace('http://', '//');
                return <audio type="audio/mpeg" src={chat} ref={(audio) => {
                    this.audios[index] = audio

                    if (audio) {
                        audio.addEventListener('ended', () => {
                            this.setState({currentPlaying: -1});
                        });
                    }
                }}>
                    <source src={chat} type="audio/mpeg"/>
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