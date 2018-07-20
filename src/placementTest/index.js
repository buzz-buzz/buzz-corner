import React from 'react';
import {Form} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import ButtonBottom from '../common/commonComponent/submitButtonBottom';
import PlacementProgress from './placementProgress';
import PlacementQuestion from './placementQuestion';
import MessageModal from '../common/commonComponent/modalMessage';
import {Placement} from "../common/systemData/placementData";
import Track from "../common/track";
import Client from "../common/client";
import ErrorHandler from "../common/error-handler";
import '../my/my.css';
import './index.css';
import CurrentUser from "../membership/user";

export default class PlacementModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar: '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg',
            step: 1,
            questions: Placement,
            answers: [],
            audioAnsweringStatus: false,
            audioAnswerUrl: '',
            audioQuestionUrl: '',
            audioQuestionLength: 0,
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
        this.goBack = this.goBack.bind(this);
        this.setMessage = this.setMessage.bind(this);
    }

    goBack() {
        if (this.state.step === 1) {
            if (this.props.location.query && this.props.location.query.tab && this.props.location.query.tab === 'message') {
                browserHistory.push('/home?tab=message');
            } else {
                browserHistory.push('/home');
            }
        } else if (this.state.step <= 6) {
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    answering(event, qNum, answer) {
        let answers = this.state.answers;
        if (qNum === 3) {
            if (!answers[qNum]) {
                answers[qNum] = [answer];
            } else if (answers[qNum] && answers[qNum].length && answers[qNum].indexOf(answer) === -1) {
                if (answers[qNum].length === 2 && !this.state.messageModal) {
                    //提示最多选两张 再次点击取消
                    this.closeMessageModal();
                    this.setMessage('最多选取两张图片哦，再次点击已选中图片"取消"选中。', 'error')
                }

                answers[qNum].length < 2 && answers[qNum].push(answer);
            } else if (answers[qNum] && answers[qNum].length && answers[qNum].indexOf(answer) > -1) {
                answers[qNum] = answers[qNum].filter(item => {
                    return item !== answer;
                });
            }
        } else {
            answers[qNum] = answer;
        }

        this.setState({
            answers: answers
        });
    }

    setMessage(message, type) {
        this.setState({
            messageModal: true,
            messageContent: message,
            messageName: type
        });

        this.closeMessageModal();
    }

    async skip() {
        browserHistory.push('/home');
    }

    async componentWillMount() {
        //如果是tablet 并且不在微信中  跳转至https
        if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0 && window.location.host !== 'localhost') {
            window.location.href = window.location.href.replace('http', 'https');
        }

        try {
            Track.event('测试_题' + this.state.step + '页面');

            let profile = await CurrentUser.getProfile();

            this.setState({
                userId: profile.user_id,
                avatar: profile.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
            });
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

            console.log(clonedAnswers);

            this.setState({
                audioAnswerUrl: url,
                audioAnsweringStatus: true,
                answers: clonedAnswers,
                messageModal: true,
                messageContent: Resources.getInstance().successUpload,
                messageName: 'success'
            });

            //close messageModal
            this.closeMessageModal();
        } else {
            Track.event('测试_录音上传过程失败');

            let clonedAnswers = this.state.answers;
            clonedAnswers[this.state.step - 1] = '';

            this.setState({
                answers: clonedAnswers,
                messageModal: true,
                messageContent: Resources.getInstance().errorUpload + ':' + JSON.stringify(url.err),
                messageName: 'error'
            });

            //close messageModal
            this.closeMessageModal();
        }
    }


    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 5000)
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

    saveStep3(){
        try{
            let placementTestData = {
                user_id: this.state.userId,
                detail: JSON.stringify({
                    questions: this.state.questions,
                    answers: this.state.answers
                })
            };

            ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                    json: placementTestData,
                    method: 'PUT'
                }
            });
        }
        catch(ex){
            ErrorHandler.notify('保存placement-3出错：', ex);
        }
    }

    async saveStep6(){
        try {
            let placementTestData = {
                user_id: this.state.userId,
                detail: JSON.stringify({
                    questions: this.state.questions,
                    answers: this.state.answers
                })
            };

            await ServiceProxy.proxyTo({
                body: {
                    uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                    json: placementTestData,
                    method: 'PUT'
                }
            });

            this.setState({loadingModal: false});

            if (this.props.location.query.intro) {
                browserHistory.push(`/home?intro=${this.props.location.query.intro}`);
            } else {
                browserHistory.push('/home');
            }
        }
        catch(ex) {
            //show error
            ErrorHandler.notify('保存placement-6出错：', ex);
            this.setState({loadingModal: false});
        }
    }

    async submit() {
        try {
            if (this.state.step < 6) {
                Track.event('测试_题' + this.state.step + '继续');

                if (this.state.step === 3) {
                    this.saveStep3();
                }

                let newStep = this.state.step + 1;

                this.setState({
                    step: newStep
                });

                Track.event('测试_题' + newStep + '页面');
            } else {
                Track.event('测试_题' + this.state.step + '完成');

                this.setState({loadingModal: true});

                await this.saveStep6();
            }
        } catch (ex) {
            console.error(ex);
            this.setState({loadingModal: false});

            if (this.props.location.query.intro) {
                browserHistory.push(`/home?intro=${this.props.location.query.intro}`);
            } else {
                browserHistory.push('/home');
            }
        }
    }

    render() {
        return (
            <div className="my-profile">
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                <HeaderWithBack goBack={this.goBack}/>
                <PlacementProgress step={this.state.step}/>
                <Form className='profile-body bottom-50px'>
                    <PlacementQuestion step={this.state.step} questions={this.state.questions}
                                       recording={this.state.recording}
                                       answering={this.answering} answers={this.state.answers}
                                       handleUploadUrl={this.handleUploadUrl.bind(this)}
                                       open={this.state.recording} setMessage={this.setMessage}
                                       avatar={this.state.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                    />
                    <div className="profile-btn-placement">
                        <ButtonBottom
                            disabled={ this.state.step === 4 ? !(this.state.answers[3] && this.state.answers[3].length === 2) : !this.state.answers[this.state.step - 1]}
                            text={Resources.getInstance().profileContinue} submit={this.submit}/>
                    </div>
                </Form>
            </div>
        );
    }
}