import React from 'react';
import {Icon, Image} from "semantic-ui-react";
import Resources from '../../resources';
import RecordModal from '../recordModal';
import LoadingModal from '../../common/commonComponent/loadingModal';
import WechatAudio from "../../wechat/audio";
import TabletAudio from "../../wechat/tabletAudio";
import './index.css';
import '../../classDetail/chat.css';
import '../../classDetail/index.css';

let recordingTime = 0;

export default class PlacementRecorder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            soundPlaying: '//cdn-corner.resource.buzzbuzzenglish.com/icon_recording.gif',
            recordingTime: 0,
            recordAudio: /MicroMessenger/.test(navigator.userAgent) ? new WechatAudio() : new TabletAudio(),
            isPlaying: false,
            recordAgainLoading: false
        };

        recordingTime = 0;

        this.recordAnswer = this.recordAnswer.bind(this);
        this.closeRecord = this.closeRecord.bind(this);
        this.recordAgain = this.recordAgain.bind(this);
        this.getTime = this.getTime.bind(this);
        this.stopRecord = this.stopRecord.bind(this);
        this.reReplyAudio = this.reReplyAudio.bind(this);
    }

    async recordAgain() {
        if (this.state.recording) {
            this.setState({recordAgainLoading: true});
            console.log('stop---recording');
            //调用停止录音方法
            await this.state.recordAudio.stopRecording();
            recordingTime = 0;
            await new Promise(resolve => window.setTimeout(resolve, 2000));
        }

        this.setState({recording: false});
        this.setState({recording: true, recordAgainLoading: false}, async() => {
            await this.state.recordAudio.startRecording();
            console.log('begin...');
        });
    }

    getTime(time) {
        recordingTime = time;
    }

    recordAnswer() {
        if (!this.state.recording && !this.props.answers[this.props.step - 1]) {
            console.log('开始录音');

            this.setState({recording: true}, async() => {
                await this.state.recordAudio.startRecording();
            });
        } else if (this.state.recording) {
            console.log('warning, 录音中...');
        } else if (this.props.answers[this.props.step - 1]) {
            console.log('播放...');
            this.reReplyAudio();
        }
    }

    async stopRecord() {
        console.log('完成录音');
        if (recordingTime && recordingTime >= 30) {
            this.setState({loadingModal: true});
        }

        this.setState({recording: false}, async() => {
            if (recordingTime && recordingTime >= 30) {
                console.log('录制时间满足条件， 可保存结果' + recordingTime);

                try {
                    let url = await this.state.recordAudio.stopRecordingWithQiniuLink();

                    this.props.handleUploadUrl({
                        url: url,
                        err: '',
                        type: 'end'
                    });
                }
                catch (ex) {
                    this.props.handleUploadUrl({
                        url: '',
                        err: ex.toString(),
                        type: 'end'
                    });
                }

                this.setState({loadingModal: false, recordingTime: recordingTime});
            } else {
                console.log('录制时间不满足条件， 不可继续' + recordingTime);
            }

            recordingTime = 0;
        });
    }

    async closeRecord() {
        console.log('关闭录音操作窗口， 录制时间清除为0');

        this.setState({recording: false}, async() => {
            await this.state.recordAudio.stopRecording();
            recordingTime = 0;
        });
    }

    async componentWillMount() {
        let audioReady = false;

        if (/MicroMessenger/.test(navigator.userAgent)) {
            try {
                await WechatAudio.init();
                audioReady = true;
            } catch (ex) {
                audioReady = false;
            }
        } else {
            let support = /MicroMessenger/.test(navigator.userAgent) ? true : navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder;

            if (support) {
                await TabletAudio.init((readyStatus) => {
                    audioReady = readyStatus;
                    this.setState({loadingAudio: !readyStatus})
                });
            } else {
                audioReady = false;
            }
        }

        this.setState({
            loadingAudio: !audioReady
        })
    }

    async componentWillUnmount() {
        if (this.state.recording) {
            await this.closeRecord();
        }
    }

    reReplyAudio() {
        this.setState({isPlaying: true});
        try{
            this.state.recordAudio.play();
        }
        catch (ex){
            return;
        }

        window.setTimeout(() => {
            this.setState({isPlaying: false});
        }, this.state.recordingTime * 1000)
    }

    render() {
        return (
            <div className="placement-record">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <div className="img-content">
                    <img className="img" src={this.props.answers[3][this.props.step - 5]} alt=""/>
                    <div className="content-description">
                        <p>1. 描述图中的人物、地点、事件</p>
                        <p>2. 描述图中人物正在使用什么</p>
                        <p>3. 结合你的感受尽可能描述的更多细节和想法</p>
                    </div>
                    <div className="practise-student chat message reverse">
                        <div style={{flex: '0 0 auto'}}>
                            <Image avatar
                                   src={this.props.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                                   alt="avatar"/>
                        </div>
                        <div onClick={this.recordAnswer}
                             className="student-word talk-bubble tri-left right-bottom border round">
                            <div className="talktext">
                                <p style={{paddingLeft: '10px', display: 'flex', alignItems: 'center'}}>
                                    {
                                        this.state.loadingAudio ?
                                            <Icon loading name="spinner"/> :
                                            <img className="rotate180" style={{height: '15px'}}
                                                 src={this.state.isPlaying ?
                                                     this.state.soundPlaying : "//cdn-corner.resource.buzzbuzzenglish.com/icon_recording_new.png"}
                                                 alt=""/>
                                    }
                                    <span>
                                        {
                                            this.props.answers[this.props.step - 1] ?
                                                Resources.getInstance().placementListeningAudio :
                                                (
                                                    this.state.loadingAudio ?
                                                        '' :
                                                        Resources.getInstance().placementRecordAudio
                                                )
                                        }
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.answers[this.props.step - 1] ?
                            <div onClick={this.recordAgain}
                                 disabled={this.state.loadingAudio}
                                 className="recordAgain">{Resources.getInstance().practiceAgain}</div>
                            : ''
                    }
                    {
                        this.props.step > 4 && this.state.recording && <RecordModal
                            open={this.state.recording}
                            recordAgain={this.recordAgain}
                            onClose={this.closeRecord}
                            stopRecord={this.stopRecord}
                            timeout={this.stopRecord}
                            getTime={this.getTime}
                        />
                    }
                    {
                        this.state.recordAgainLoading &&
                        <div className="record-again-loading">
                            <Icon loading name="spinner"/>
                        </div>
                    }
                </div>
            </div>
        )
    }
}