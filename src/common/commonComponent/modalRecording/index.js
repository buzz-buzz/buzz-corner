import * as React from "react";
import BuzzModal from "../buzzModal/index";
import {Header, Image} from "semantic-ui-react";
import QiniuDomain from '../../systemData/qiniuUrl';
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
                        <Image src={QiniuDomain + "/icon_Siri%20Mic.png"} alt="recording"
                               style={{height: '100px', display: 'inline', textAlign: 'center'}}/>
                    </div>
                    <Header style={{fontWeight: 'normal', fontFamily: 'serif'}}>
                        <StopWatch start={0} timeout={this.props.timeout} visible={this.props.open} />
                    </Header>
                </div>
                <p>&nbsp;</p>
                <div className="begin">
                    <div onClick={this.props.onOK}>
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
        return (
            super.render(this.renderBody())
        );
    }

}