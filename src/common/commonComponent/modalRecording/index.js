import * as React from "react";
import BuzzModal from "../buzzModal/index";
import {Header, Image} from "semantic-ui-react";
import StopWatch from "../StopWatch/index";
import Resources from "../../../resources";


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
                    <div>
                        <Image src="http://p579tk2n2.bkt.clouddn.com/icon_Siri%20Mic.png" alt="recording"
                               style={{height: '100px', display: 'inline', textAlign: 'center'}}/>
                    </div>
                    <Header style={{fontWeight: 'normal', fontFamily: 'serif'}}>
                        <StopWatch start={0} timeout={this.props.timeout}></StopWatch>
                    </Header>
                </div>
                <p>&nbsp;</p>
                <div className="begin">
                    <div onTouchStart={this.props.onOK}>
                        <p>{Resources.getInstance().finishRecording}</p>
                    </div>
                </div>

                <div className="skip" onClick={this.closeWelcome}>
                    &nbsp;
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