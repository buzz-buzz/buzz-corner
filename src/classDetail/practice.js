import * as React from "react";
import {Divider, Icon, Image} from "semantic-ui-react";
import './chat.css';

export default class Practice extends React.Component {
    constructor() {
        super()

        this.state = {}
    }

    render() {
        return <div>

            <Divider horizontal></Divider>
            <div>
                <div className="practise-advisor chat message">
                    <Image avatar src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                           alt="avatar"/>
                    <div className="advisor-word talk-bubble tri-right left-bottom border round">
                        <div className="talktext">
                            <p>
                                How are you?
                                <Icon name="rss" className="sound"/>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="practise-student chat message">
                    <div className="student-word talk-bubble tri-left right-bottom border round">
                        <div className="talktext">
                            <p>
                                <Icon name="rss" className="flipped sound"/>
                                not bad
                            </p>
                        </div>
                    </div>
                    <Image avatar src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"
                           alt="avatar"/>
                    <p className="tip">Press to record again</p>
                </div>
            </div>
            <Divider horizontal/>
        </div>
    }
}