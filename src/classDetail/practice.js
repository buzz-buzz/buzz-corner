import * as React from "react";
import {Dimmer, Divider, Header, Icon, Image, Segment} from "semantic-ui-react";
import Resources from '../resources';
import './chat.css';
import WechatAudio from "../wechat/audio";

let wechatAudio = new WechatAudio()

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

        await wechatAudio.startRecording()
    }

    reply() {
        console.log('replying...');
    }

    async endReply() {
        console.log('ended recording');

        if(this.props.audioUpload){
            let url = 'hank'; //await wechatAudio.stopRecordingWithQiniuLink();

            this.props.handleUploadUrl(url);
        }else{
            this.recordingStarted = false;
            this.setState({recording: false})

            await wechatAudio.stopRecording()

            let replies = this.state.replies;
            replies[replies.length - 1] = {
                text: 'replying'
            };

            if (this.props.chats.length > this.state.replies.length) {
                replies.push({});
            }

            this.setState({replies});
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
        await wechatAudio.init();
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
                                                       src={this.props.avatars[0]}
                                                       alt="avatar"/>
                                            </div>
                                            <div className="advisor-word talk-bubble tri-right left-bottom border round">
                                                <div className="talktext"
                                                     onTouchStart={() => this.play(i)}>
                                                    <p>
                                                        {Resources.getInstance().placementListeningAudio}
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
                                                       src={this.props.avatars[1]}
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