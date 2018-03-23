import * as React from "react";
import {Dimmer, Divider, Header, Icon, Image, Segment} from "semantic-ui-react";
import Resources from '../resources';
import './chat.css';
import WechatAudio from "../wechat/audio";
import CurrentUser from "../membership/user";
import ServiceProxy from "../service-proxy";

export default class Practice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            replies: [{
                wechatAudio: new WechatAudio()
            }]
        }

        this.audios = {};

        this.reply = this.reply.bind(this);
        this.renderChat = this.renderChat.bind(this);
        this.play = this.play.bind(this);
        this.endReply = this.endReply.bind(this);
        this.replyButtonClicked = this.replyButtonClicked.bind(this);
        this.cancelReply = this.cancelReply.bind(this);
    }

    async replyButtonClicked(buttonIndex = this.state.replies.length - 1) {
        console.log(`the ${buttonIndex} button was clicked`)
        if (!this.state.replies[buttonIndex].answered) {
            this.setState({recording: true}, () => {
                this.props.recordingChanged(this.state.recording);
            });
            await this.state.replies[buttonIndex].wechatAudio.startRecording()
        } else {
            this.state.replies[buttonIndex].wechatAudio.play();
        }
    }

    reply() {
        console.log('replying...');
    }

    async endReply() {
        if (this.props.audioUpload) {
            try{
                if (document.getElementById('loadingModal')) {
                    document.getElementById('loadingModal').style.display = 'block';
                }

                let url = await this.state.replies[this.state.replies.length - 1].wechatAudio.stopRecordingWithQiniuLink();

                this.props.handleUploadUrl(url);
            }
            catch (ex){
                this.props.handleUploadUrl('');
            }

        } else {
            if (!this.state.recording) {
                console.log('no need to end recording...');
                return;
            }

            this.setState({recording: false}, () => {
                this.props.recordingChanged(this.state.recording);
            })

            await this.state.replies[this.state.replies.length - 1].wechatAudio.stopRecording()

            // 等待 2 秒，形成一种对方正在回复的感觉
            this.setState({
                replying: true
            })
            await new Promise(resolve => window.setTimeout(resolve, 2000));
            this.setState({
                replying: false
            })

            let replies = this.state.replies;
            replies[replies.length - 1].text = 'replying';
            replies[replies.length - 1].answered = true;

            if (this.props.chats.length > this.state.replies.length) {
                replies.push({
                    wechatAudio: new WechatAudio()
                });
            }

            this.setState({replies});
        }
    }

    async cancelReply() {
        this.setState({recording: false}, () => {
            this.props.recordingChanged(this.state.recording);
        });
        console.log('reply cancelled');
        await            this.state.replies[this.state.replies.length - 1].wechatAudio.stopRecording()
    }

    play(index) {
        if (this.audios[index]) {
            this.audios[index].play()
        }
    }

    async componentDidMount() {
        WechatAudio.init()
        let userId = await CurrentUser.getUserId();
        let userInfo = await ServiceProxy.proxyTo({body: {uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`}});
        this.setState({
            avatar: userInfo.avatar
        })
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
                                             onTouchStart={() => this.replyButtonClicked(i)}
                                            // onTouchEnd={this.endReply}
                                            //  onTouchMoveCapture={this.reply}
                                        >


                                            <div>
                                                <Image avatar
                                                       src={this.state.avatar}
                                                       alt="avatar"/>
                                            </div>

                                            <div className="student-word talk-bubble tri-left right-bottom border round">
                                                <div className="talktext">
                                                    <p>
                                                        <Icon name="rss" className="flipped sound"/>
                                                        {
                                                            i === this.state.replies.length - 1 &&
                                                            <span>{this.state.replies[this.state.replies.length - 1].answered ? Resources.getInstance().placementListeningAudio : Resources.getInstance().placementRecordAudio}</span>
                                                        }
                                                    </p>
                                                </div>

                                                {
                                                    i === this.state.replies.length - 1 &&
                                                    <p className="tip">&nbsp;</p>
                                                }
                                            </div>

                                        </div>
                                    </div>
                                );
                            }
                        )
                    }


                    {
                        this.state.replying &&

                        <div className="practise-advisor chat message">
                            <div>
                                <Image avatar src={this.props.avatars[0]} alt="avatar"/>
                            </div>
                            <div
                                className="advisor-word talk-bubble tri-right left-bottom border round">
                                <div className="talktext">
                                    <p>
                                        <Icon loading name='spinner'/>
                                        <Icon name="ellipsis horizontal"/>
                                    </p>
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