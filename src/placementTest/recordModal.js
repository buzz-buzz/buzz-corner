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

        this.modal = {};

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

    componentDidMount(){
        this.modal.style.animation = 'record-move-show .3s linear';
    }

    render() {
        return (
            <div className="record-control"  ref={div => {this.modal = div;}}>
                <div className="button-record-again" onClick={this.props.recordAgain}>
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_Retake%20it.svg" alt=""/>
                </div>
                <div className="button-record-status">
                    <div className="status-img" onClick={ this.props.open ? ()=>{} : this.props.recordAnswer}>
                        <img src={ !this.props.open ? "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_Siri_Mic.svg" : "//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_suspended.svg"} alt=""/>
                    </div>
                    <span>
                        {
                            this.props.open ? <TimerWatch start={this.state.done ? 30 : 0} timeout={this.props.timeout}
                                                          visible={this.props.open} getTime={this.getTime}/> : '点击开始'
                        }
                    </span>
                </div>
                <div className="button-record-done" onClick={this.stopRecord}>
                    <img src={this.state.done ? "///cdn-corner.resource.buzzbuzzenglish.com/placement/icon_complete_active.svg":"//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_complete.svg"} alt=""/>
                </div>
                <div className="half-circle"></div>
                <div className="close" onClick={this.onClose}>
                    <img className="img-close" src="//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_close.svg"
                         alt=""/>
                </div>
            </div>
        )
    }
}