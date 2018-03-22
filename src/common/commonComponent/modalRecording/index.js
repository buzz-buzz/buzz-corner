import * as React from "react";
import BuzzModal from "../buzzModal/index";
import {Header, Icon} from "semantic-ui-react";
import StopWatch from "../StopWatch/index";


export default class RecordingModal extends BuzzModal {
    constructor(props) {
        super(props);

        this.state = {};
    }

    onClose() {
        this.props.onClose()
    }

    componentDidMount() {
    }

    renderBody() {
        return (
            <div>
                <div className="welcome-title">
                    <Icon name="unmute" className="massive"/>
                </div>
                <div className="welcome-info">
                    <Header style={{fontWeight: 'normal', fontFamily: 'serif'}}><StopWatch
                        start={0} timeout={this.props.timeout}></StopWatch></Header>
                </div>
                <div className="begin">
                    <div onTouchStart={this.props.onOK}>
                        <p>完成录音</p>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        console.log('recording props = ', this.props);
        return (
            super.render(this.renderBody())
        );
    }

}