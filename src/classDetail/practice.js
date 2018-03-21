import * as React from "react";
import {Dimmer, Divider, Header, Icon, Image, Segment} from "semantic-ui-react";
import './chat.css';
import wechatAudio from "../wechat/audio";

export default class Practice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            replies: [{}]
        }

        this.audios = {};

        this.reply = this.reply.bind(this);
        this.renderChat = this.renderChat.bind(this);
        this.play = this.play.bind(this);
        this.endReply = this.endReply.bind(this);
        this.replyStart = this.replyStart.bind(this);
        this.cancelReply = this.cancelReply.bind(this);
    }

    async replyStart() {
        this.recordingStarted = true;
        this.setState({recording: true});

        await wechatAudio.startRecording(async localId => {
            this.wechatLocalId = localId
        })
    }

    reply() {
        console.log('replying...');
    }

    async endReply() {
        console.log('ended recording');
        this.recordingStarted = false;
        this.setState({recording: false})

        if (this.wechatLocalId || true) {
            const localId = await wechatAudio.stopRecord()
            const serverId = await wechatAudio.uploadVoice(localId)
            let result = await wechatAudio.updateVoice({serverId})
            console.log('result = ', result);


            let replies = this.state.replies;
            replies[replies.length - 1] = {
                text: 'replying'
            };

            if (this.props.chats.length > this.state.replies.length) {
                replies.push({});
            }

            this.setState({replies});
        } else {
            alert('录音失败！')
        }
    }

    cancelReply() {
        this.recordingStarted = false;
        this.setState({recording: false});
        console.log('reply cancelled');
    }

    play(index) {
        if (this.audios[index]) {
            this.audios[index].play()
        }
    }

    async componentDidMount() {
        await wechatAudio.init({
            debug: false,
            jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice'],
            url: window.location.href.split('#')[0],
        });
    }

    render() {
        return (
            <Dimmer.Dimmable as={Segment} className="basic" dimmed={this.state.recording}>
                <Divider horizontal></Divider>
                <div>
                    {
                        this.state.replies.map((r, i) => {
                                return (
                                    <div key={i}>
                                        <div className="practise-advisor chat message">
                                            <div>
                                                <Image avatar
                                                       src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                                                       alt="avatar"/>
                                            </div>
                                            <div className="advisor-word talk-bubble tri-right left-bottom border round">
                                                <div className="talktext"
                                                     onTouchStart={() => this.play(i)}>
                                                    <p>
                                                        {this.renderChat(this.props.chats ? this.props.chats[i] : null, i)}

                                                        <Icon name="rss" className="sound"/>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="practise-student chat message reverse"
                                             onTouchStart={i === this.state.replies.length - 1 ? this.replyStart : () => {
                                             }} onTouchEnd={this.endReply} onTouchMoveCapture={this.reply}>


                                            <div>
                                                <Image avatar
                                                       src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                                                       alt="avatar"/>
                                            </div>

                                            <div className="student-word talk-bubble tri-left right-bottom border round">
                                                <div className="talktext">
                                                    <p>
                                                        <Icon name="rss" className="flipped sound"/>
                                                        {
                                                            i === this.state.replies.length - 1 &&
                                                            <span>Tap to record</span>
                                                        }
                                                    </p>
                                                </div>

                                                {
                                                    i === this.state.replies.length - 1 &&
                                                    <p className="tip">Press to record again</p>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                );
                            }
                        )
                    }
                </div>
                <Divider horizontal/>
                <Dimmer active={this.state.recording} onClickOutside={this.cancelReply}>
                    <Header as='h2' icon inverted>
                        <Icon name="unmute"/>
                        Recording!
                    </Header>
                </Dimmer>
            </Dimmer.Dimmable>
        )
    }

    renderChat(chat, index) {
        if (chat) {
            if (chat.startsWith('http') || chat.startsWith('//')) {
                chat = chat.replace('http://', '//');
                return <audio src={chat} ref={(audio) => {
                    this.audios[index] = audio
                }}></audio>

            } else {
                return chat;
            }
        } else {
            return '';
        }
    }
}