import React from 'react';
import TimerWatch from "./TimerWatch";
import './record.css';

let recordingTime = 0;

export default class RecordModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            done: false
        };

        this.getTime = this.getTime.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    getTime(time) {
        if (time > 29) {
            this.setState({done: true});
        }

        recordingTime = time;

        this.props.getTime(time);
    }

    async stopRecord() {
        if (recordingTime >= 30) {
            recordingTime = 0;

            this.setState({
                done: false
            }, async() => {
                await this.props.stopRecord();
            });
        }
    }

    async onClose() {
        recordingTime = 0;

        this.setState({
            done: false
        }, async() => {
            await this.props.onClose();
        });
    }

    render() {
        return (
            <div className="record-control">
                <div className="button-record-again" onClick={this.props.recordAgain}>
                    重录
                </div>
                <div className="button-record-status">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_Siri_Mic.svg" alt=""/>
                    <span>
                       <TimerWatch start={this.state.done ? 30 : 0} timeout={this.props.timeout}
                                   visible={this.props.open} getTime={this.getTime}/>
                    </span>
                </div>
                <div className="button-record-done" onClick={this.stopRecord}
                     style={this.state.done ? {borderColor: '#6ae108', color: '#6ae108'} : {
                             borderColor: '#d0d6db',
                             color: '#d0d6db'
                         }}>
                    完成
                </div>
                <div className="close" onClick={this.onClose}>
                    <img className="img-close" src="//cdn-corner.resource.buzzbuzzenglish.com/placement-close.svg"
                         alt=""/>
                </div>
            </div>
        )
    }
}