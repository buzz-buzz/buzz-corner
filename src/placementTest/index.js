import React from 'react';
import _ from 'lodash';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import LoadingModal from '../common/commonComponent/loadingModal';
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import ButtonBottom from '../common/commonComponent/submitButtonBottom';
import WhiteSpace from '../common/commonComponent/whiteSpace';
import Progress from './placementProgress/progress';
import WeappDone from './weappDone';
import PlacementQuestion from './placementQuestion';
import MessageModal from '../common/commonComponent/modalMessage';
import {Placement} from "../common/systemData/placementData";
import Track from "../common/track";
import ErrorHandler from "../common/error-handler";
import CurrentUser from "../membership/user";
import Back from '../common/back';
import './index.css';

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
            recording: false,
            weapp: props.location.query.weapp
        };

        this.saveAnswer = this.saveAnswer.bind(this);
        this.submit = this.submit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.setMessage = this.setMessage.bind(this);
        this.goHomePage = this.goHomePage.bind(this);
        this.skip = this.skip.bind(this);
    }

    goBack() {
        if (this.state.step === 1) {
            if (this.props.location.query && this.props.location.query.tab && this.props.location.query.tab === 'message') {
                browserHistory.push('/home?tab=message');
            } else if(!this.state.weapp){
                Back.back();
            }
        } else if (this.state.step <= 6) {
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        } else if (this.state.step === 7) {
            this.goHomePage();
        }
    }

    saveAnswer(event, qNum, answer) {
        let answers = this.state.answers;
        if (qNum === 3) {
            if (!answers[qNum] || _.isEmpty(answers[qNum])) {
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

    async componentWillMount() {
        alert(document.body.offsetHeight+ '-'+ document.documentElement.clientHeight +'-' + window.innerHeight);

        //如果不在微信中  跳转至https
        if (!/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0 && window.location.host !== 'localhost') {
            window.location.href = window.location.href.replace('http', 'https');
        }

        try {
            Track.event('测试_题' + this.state.step + '页面');

            if (this.state.weapp) {
                //openid, phone-number
                //unionid purePhoneNumber countryCode
                //perfect login
                let user = ServiceProxy.proxyTo({
                    body: {
                        uri: `{config.endPoints.buzzService}/api/v1/users/signInWithWechatMobile`,
                        json: JSON.parse(window.atob(this.state.weapp)),
                        method: 'POST'
                    }
                });

                this.setState({
                    userId: user.user_id,
                    avatar: user.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
                });
            } else {
                let profile = await CurrentUser.getProfile();

                this.setState({
                    userId: profile.user_id,
                    avatar: profile.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'
                });
            }
        }
        catch (ex) {
            alert(ex);
            ErrorHandler.notify('Placement发生错误', ex);

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
            ErrorHandler.notify('测试_录音上传过程失败');

            let clonedAnswers = this.state.answers;
            clonedAnswers[this.state.step - 1] = '';

            this.setState({
                answers: clonedAnswers,
                messageModal: true,
                messageContent: Resources.getInstance().errorUpload + ':' + JSON.stringify(url.err),
                messageName: 'error'
            });

            this.closeMessageModal();
        }
    }


    closeMessageModal() {
        const interval = setTimeout(() => {
            if (this.state.messageModal) {
                this.setState({messageModal: false});
            }

            clearTimeout(interval);
        }, 3000)
    }

    saveStep3() {
        try {
            this.savePlacement();
        }
        catch (ex) {
            ErrorHandler.notify('保存placement-3出错：', ex);
        }
    }

    async saveStep6() {
        try {
            await this.savePlacement();

            let newStep = this.state.step + 1;

            this.setState({loadingModal: false, step: newStep});
        }
        catch (ex) {
            //show error
            ErrorHandler.notify('保存placement-6出错：', ex);
            this.setState({loadingModal: false});
        }
    }

    savePlacement() {
        let placementTestData = {
            user_id: this.state.userId,
            detail: JSON.stringify({
                questions: this.state.questions,
                answers: this.state.answers,
                version: 2.0
            })
        };

        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                json: placementTestData,
                method: 'PUT'
            }
        });
    }

    goHomePage() {
        if (this.props.location.query.intro) {
            browserHistory.push(`/home?intro=${this.props.location.query.intro}`);
        } else {
            browserHistory.push('/home');
        }
    }

    async skip() {
        try {
            this.savePlacement();
        }
        catch (ex) {
            ErrorHandler.notify('保存placement-skip出错：', ex);
        }
        this.goHomePage();
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
            } else if (this.state.step === 6) {
                Track.event('测试_题' + this.state.step + '完成');

                this.setState({loadingModal: true});

                await this.saveStep6();
            } else if (this.state.step === 7) {
                Track.event('测试_题全部完成');

                this.goHomePage();
            }
        } catch (ex) {
            console.error(ex);
            this.setState({loadingModal: false}, () => {
                this.goHomePage();
            });
        }
    }

    render() {
        return (
            <div className="placement" style={{position: 'relative'}}>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                <MessageModal modalName={this.state.messageName} modalContent={this.state.messageContent}
                              modalShow={this.state.messageModal}/>
                {
                    (this.state.step === 5 || this.state.step === 6) ?
                        <HeaderWithBack goBack={this.goBack} rightTitle="跳过" rightClick={this.skip}/>
                        :
                        <HeaderWithBack goBack={this.goBack}/>
                }
                {
                    this.state.step <= 6 &&
                    <Progress step={this.state.step}/>
                }
                {
                    this.state.step === 7 &&
                    (this.state.weapp ? <WeappDone/>
                        :
                        <WhiteSpace message="非常感谢完成了语言档案的建立, 根据语言档案我们会提供更合适学员的学习计划。"
                                    src="//cdn-corner.resource.buzzbuzzenglish.com/placement/icon_Language_profile.svg"
                                    width="50%"
                                    style={{background: 'white'}}
                        />)
                }
                <div className='placement-body'
                     style={this.state.step <= 4 ? {background: '#f4f5f9'} : {background: 'white'}}>
                    {
                        this.state.step <= 6 &&
                        <PlacementQuestion step={this.state.step} questions={this.state.questions}
                                           recording={this.state.recording}
                                           saveAnswer={this.saveAnswer} answers={this.state.answers}
                                           handleUploadUrl={this.handleUploadUrl.bind(this)}
                                           open={this.state.recording} setMessage={this.setMessage}
                                           avatar={this.state.avatar || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                        />
                    }
                    {
                        !(this.state.weapp && this.state.step === 7 ) ?
                            <div className="profile-btn-placement">
                                <ButtonBottom
                                    disabled={ this.state.step === 4 ? !(this.state.answers[3] && this.state.answers[3].length === 2)
                                        : ( this.state.step === 7 ? false : !this.state.answers[this.state.step - 1])}
                                    text={this.state.step <= 6 ? Resources.getInstance().profileContinue : Resources.getInstance().welcomePageBooking}
                                    submit={this.submit}/>
                            </div> : ''
                    }
                </div>
            </div>
        );
    }
}