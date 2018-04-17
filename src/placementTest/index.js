import React, {Component} from 'react';
import {Button, Form, Header, Icon, Modal} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import Practice from "../classDetail/practice";
import RecordingModal from "../common/commonComponent/modalRecording/index";
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import {MemberType} from "../membership/member-type";
import Track from "../common/track";
import '../my/my.css';
import './index.css';
import CurrentUser from "../membership/user";

class Homepage extends Component {
    handleClose = () => this.setState({modalOpen: false});

    constructor(props) {
        super(props);

        this.state = {
            avatar: '//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd',
            step: props.location.query.step || 1,
            questions: [
                {
                    title: Resources.getInstance().placementQuestion1,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion2,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion3,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion4,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion5,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion6,
                    items: [
                        Resources.getInstance().placementYes,
                        Resources.getInstance().placementNo
                    ]
                },
                {
                    title: Resources.getInstance().placementQuestion7,
                    items: [
                        Resources.getInstance().placementQuestion7Answer1,
                        Resources.getInstance().placementQuestion7Answer2,
                        Resources.getInstance().placementQuestion7Answer3
                    ]
                }
            ],
            answers: [],
            audioAnsweringStatus: false,
            audioAnswerUrl: '',
            audioQuestionUrl: '',
            audioQuestionLength: 0,
            modalOpen: false,
            errorMessage: Resources.getInstance().errorUpload,
            chats: [],
            recording: false
        };

        this.answering = this.answering.bind(this);
        this.skip = this.skip.bind(this);
        this.submit = this.submit.bind(this);
        this.recordingChanged = this.recordingChanged.bind(this);
        this.cancelRecording = this.cancelRecording.bind(this);
        this.finishRecording = this.finishRecording.bind(this);
        this.goBack = this.goBack.bind(this)
    }

    goBack() {
        if (this.state.step === 1) {
            if(this.props.location.query && this.props.location.query.tab && this.props.location.query.tab === 'message'){
                browserHistory.push('/home?tab=message');
            }else{
                browserHistory.push('/home');
            }
        } else if (this.state.step <= 8) {
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    answering(event) {
        let answers = this.state.answers;
        answers[parseFloat(event.target.name[0]) - 1] = event.target.name[1];

        this.setState({
            answers: answers
        });
    }

    async skip() {
        browserHistory.push('/home');
    }

    async componentDidMount() {
        Track.event('测试_题' + this.state.step + '页面');

        try {
            let profile = await CurrentUser.getProfile();

            if(profile.role && profile.role === MemberType.Companion){
                browserHistory.push('/');
            }else{
                this.setState({
                    userId: profile.user_id,
                    avatar: profile.avatar || '//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd'
                });
            }
        }
        catch (ex) {
            console.log(ex.toString());
        }
    }

    handleUploadUrl(url) {
        this.setState({loadingModal: false});

        if (url.url && url.type === 'end') {
            //qiniu url
            Track.event('测试_录音上传七牛成功');

            let clonedAnswers = this.state.answers;
            clonedAnswers[this.state.step - 1] = url.url;

            this.setState({
                audioAnswerUrl: url,
                audioAnsweringStatus: true,
                answers: clonedAnswers
            });
        } else if (url.type === 'end') {
            Track.event('测试_录音上传过程失败');

            this.setState({
                modalOpen: true,
                errorMessage: url.err
            });
        }
    }

    checkPlacementAnswer() {
        if (this.state.answers.length === 8) {
            return true;
        } else {
            return false;
        }
    }

    recordingChanged(recordingStatus) {
        console.log('recording status = ', recordingStatus);
        if (recordingStatus === false) {
            this.setState({loadingModal: true});
        }
        this.setState({recording: recordingStatus})
    }

    cancelRecording() {
        Track.event('测试_点击取消录音');

        if (this.practice) {
            this.practice.cancelReply();
        }
    }

    finishRecording() {
        Track.event('测试_点击完成录音');

        console.log('end reply');
        if (this.practice) {
            this.practice.endReply();
        }
    }

    async submit() {
        try {
            if (this.state.step < 8) {
                Track.event('测试_题' + this.state.step + '继续');

                let newStep = this.state.step + 1;

                if (this.state.step === 7) {
                    let answerSeventh = this.state.answers[6];

                    let audioUrl = answerSeventh === 'A' ? 'http://p579tk2n2.bkt.clouddn.com/Placement%201.mp3' : (answerSeventh === 'B' ? 'http://p579tk2n2.bkt.clouddn.com/Placement%202.mp3' : 'http://p579tk2n2.bkt.clouddn.com/Placement%203.mp3');
                    let audioQuestionLength = answerSeventh === 'A' ? 5 : (answerSeventh === 'B' ? 13 : 11);

                    console.log(audioUrl, audioQuestionLength);

                    this.setState({
                        step: newStep,
                        audioQuestionUrl: audioUrl,
                        audioQuestionLength: audioQuestionLength,
                        chats: [audioUrl]
                    });
                } else {
                    this.setState({
                        step: newStep
                    });
                }

                Track.event('测试_题' + newStep + '页面');
            } else {
                Track.event('测试_题' + this.state.step + '完成');

                //done
                this.setState({loadingModal: true});

                if (this.checkPlacementAnswer()) {
                    let placementTestData = {
                        user_id: this.state.userId,
                        detail: JSON.stringify({
                            questions: this.state.questions,
                            answers: this.state.answers
                        })
                    };

                    console.log('已完成.........');
                    console.log(this.state.answers);

                    await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                            json: placementTestData,
                            method: 'PUT'
                        }
                    });

                    this.setState({loadingModal: false});
                    browserHistory.push('/home');
                } else {
                    //show error
                    alert('answer is wrong:' + this.state.answers.length);

                    this.setState({loadingModal: false});
                }

            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
            this.setState({loadingModal: false});
            browserHistory.push('/home');
        }
    }

    render() {
        return (
            <div className="my-profile">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <HeaderWithBack goBack={this.goBack} />
                <div className="profile-progress placement-test">
                    <div className={this.state.step > 1 ? 'done' : (this.state.step === 1 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>1</p>
                    </div>
                    <div className={this.state.step > 2 ? 'done' : (this.state.step === 2 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>2</p>
                    </div>
                    <div className={this.state.step > 3 ? 'done' : (this.state.step === 3 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>3</p>
                    </div>
                    <div className={this.state.step > 4 ? 'done' : (this.state.step === 4 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>4</p>
                    </div>
                    <div className={this.state.step > 5 ? 'done' : (this.state.step === 5 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>5</p>
                    </div>
                    <div className={this.state.step > 6 ? 'done' : (this.state.step === 6 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>6</p>
                    </div>
                    <div className={this.state.step > 7 ? 'done' : (this.state.step === 7 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>7</p>
                    </div>
                    <div className={this.state.step > 8 ? 'done' : (this.state.step === 8 ? 'active' : '' )}>
                        <div className="dot">
                            <div className="line-left line-left-last"></div>
                            <div className="circle"></div>
                        </div>
                        <p>8</p>
                    </div>
                </div>
                <Form className='profile-body'>
                    {
                        this.state.step <= 7 ?
                            (<div className="first placement-first">
                                <div className="first-question">
                                    <div>
                                        <img src="//p579tk2n2.bkt.clouddn.com/buzz-teacher.png" alt=""/>
                                    </div>
                                    <div className="first-title">
                                        <p>{this.state.questions[this.state.step - 1].title}</p>
                                    </div>
                                </div>
                                <div className="first-answer">
                                    <div className="answer-title"
                                         style={{fontSize: '.8em'}}>{Resources.getInstance().placementSelectWord}</div>
                                    {
                                        this.state.questions[this.state.step - 1].items.map((item, index) => {
                                            return <div className="answer-item" key={index}
                                                        style={this.state.answers[this.state.step - 1] === (index === 0 ? 'A' : (index === 1 ? 'B' : 'C')) ? {
                                                            color: 'rgb(246, 180, 12)',
                                                            border: '1px solid rgb(246, 180, 12)'
                                                        } : {}}>
                                                <div className="item-value">
                                                    <p>{index === 0 ? 'A' : (index === 1 ? 'B' : 'C')}</p>
                                                </div>
                                                <div className="item-content">
                                                    <p>{item}</p>
                                                </div>
                                                <button className="click-event"
                                                        name={this.state.step + '' + (index === 0 ? 'A' : (index === 1 ? 'B' : 'C'))}
                                                        onClick={this.answering}>hidden
                                                </button>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>)
                            :
                            (
                                (<div className="placement-second">
                                    <div className="second-title">
                                        <p>{Resources.getInstance().placementAudioWord}</p>
                                    </div>
                                    <Practice chats={this.state.chats}
                                              avatars={["//p579tk2n2.bkt.clouddn.com/buzz-teacher.png", this.state.avatar]}
                                              handleUploadUrl={this.handleUploadUrl.bind(this)} audioUpload={true}
                                              recordingChanged={this.recordingChanged} ref={p => this.practice = p}/>
                                </div>)
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content={Resources.getInstance().profileContinue}
                                    style={this.state.answers[this.state.step - 1] === undefined ? {
                                        margin: '2em auto .5em auto',
                                        width: '100%',
                                        color: 'rgb(255, 255, 255)',
                                        height: '4em',
                                        fontWeight: 'normal',
                                        borderRadius: '30px',
                                        backgroundColor: 'rgb(223,223,238)'
                                    } : {
                                        margin: '2em auto .5em auto',
                                        width: '100%',
                                        color: 'rgb(255, 255, 255)',
                                        background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))',
                                        height: '4em',
                                        fontWeight: 'normal',
                                        borderRadius: '30px'
                                    }} disabled={this.state.answers[this.state.step - 1] === undefined}
                                    onClick={this.submit}/>
                    </Form.Group>
                </Form>
                <br/>
                <Modal
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    basic
                    size='small'
                >
                    <Header icon='browser' content={Resources.getInstance().errorModalContent}/>
                    <Modal.Content>
                        <h3>{this.state.errorMessage}</h3>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' onClick={this.handleClose} inverted>
                            <Icon name='checkmark'/> {Resources.getInstance().errorModalBtn}
                        </Button>
                    </Modal.Actions>
                </Modal>
                <RecordingModal open={this.state.recording} onClose={this.cancelRecording}
                                onOK={this.finishRecording} timeout={this.finishRecording}/>
            </div>
        );
    }
}

export default Homepage;
