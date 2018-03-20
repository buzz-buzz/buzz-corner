import * as React from "react";
import {Divider, Icon, Image} from "semantic-ui-react";
import './chat.css';

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
    }

    reply() {
        console.log('replying...');
        let replies = this.state.replies;
        replies[replies.length - 1] = {
            text: 'hahaha'
        };

        if (this.props.chats.length > this.state.replies.length) {
            replies.push({});
        }

        this.setState({replies});
    }

    play(index) {
        if (this.audios[index]) {
            this.audios[index].play()
        }
    }

    render() {
        return <div>

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
                                            <div className="talktext" onClick={() => this.play(i)}
                                                 onTouchStart={() => this.play(i)}>
                                                <p>
                                                    {this.renderChat(this.props.chats ? this.props.chats[i] : null, i)}

                                                    <Icon name="rss" className="sound"/>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="practise-student chat message reverse"
                                         onClick={i === this.state.replies.length - 1 ? this.reply : () => {
                                             console.log(i);
                                             return false;
                                         }} onTouchStart={i === this.state.replies.length - 1 ? this.reply : () => {
                                    }}>


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
        </div>
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