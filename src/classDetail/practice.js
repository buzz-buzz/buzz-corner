import * as React from "react";
import {Divider, Icon, Image} from "semantic-ui-react";
import './chat.css';

export default class Practice extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            replies: [{}]
        }

        this.reply = this.reply.bind(this);
    }

    reply() {
        let replies = this.state.replies;
        replies[replies.length - 1] = {
            text: 'hahaha'
        };

        replies.push({});

        this.setState({replies});
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
                                    <Image avatar
                                           src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                                           alt="avatar"/>
                                    <div className="advisor-word talk-bubble tri-right left-bottom border round">
                                        <div className="talktext">
                                            <p>
                                                {this.props && this.props.chats ? this.props.chats[i] : 'empty'}
                                                <Icon name="rss" className="sound"/>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="practise-student chat message" onClick={this.reply}>
                                    <div className="student-word talk-bubble tri-left right-bottom border round">
                                        <div className="talktext">
                                            <p>
                                                <Icon name="rss" className="flipped sound"/>
                                                not bad
                                            </p>
                                        </div>
                                    </div>
                                    <Image avatar
                                           src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                                           alt="avatar"/>
                                    <p className="tip">Press to record again</p>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <Divider horizontal/>
        </div>
    }
}