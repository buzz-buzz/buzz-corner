import React, {Component} from 'react';
import {Form, Button, Segment} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import {Link} from "react-router";
import Resources from '../resources';
import ServiceProxy from '../service-proxy';
import '../my/my.css';
import './index.css';

class Homepage extends Component {
    constructor() {
        super();

        this.state = {
            step: 1,
            questions: [
                {
                    title: '你是否容易交到朋友',
                    items: [
                         '是',
                         '否'
                    ]
                },
                {
                    title: '你是否喜欢发言',
                    items: [
                        '是',
                        '否'
                    ]
                },
                {
                    title: '与不熟悉的伙伴同行，能很快加入谈话',
                    items: [
                        '能',
                        '不能'
                    ]
                },
                {
                    title: '当其他伙伴不提出自己的建议时，能提出自己的看法',
                    items: [
                        '能',
                        '不能'
                    ]
                },
                {
                    title: '在许多人和陌生人面前，不会感到不舒服',
                    items: [
                        '会',
                        '不会'
                    ]
                },
                {
                    title: '喜欢与他人谈话的活动',
                    items: [
                        '喜欢',
                        '不喜欢',
                    ]
                },
                {
                    title: '以下情况，你属于哪一种？',
                    items: [
                        '需要翻译听懂常用指令,能简短介绍个人和兴趣爱好',
                        '能听懂常用指令并做出反应，能清楚地介绍自己，能简单描述一件事',
                        '能比较有条理地描述个人体验和表达个人想法'
                    ]
                }
             ],
            answers: [],
            audioAnsweringStatus: false,
            audioAnswerUrl: '',
            audioQuestionUrl: '',
            audioQuestionLength: 0
        };

        this.answering = this.answering.bind(this);
        this.skip = this.skip.bind(this);
        this.submit = this.submit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.playQuestionVideo = this.playQuestionVideo.bind(this);
        this.playRecordedVideo = this.playRecordedVideo.bind(this);
        this.helpModalShow = this.helpModalShow.bind(this);
        this.closeHelpModal = this.closeHelpModal.bind(this);
    }

    goBack(){
        if(this.state.step === 1){
            browserHistory.push('/home');
        }else if(this.state.step <= 4){
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    playQuestionVideo(){
        document.getElementById('playQuestionAudio').play();
    }

    playRecordedVideo(){
        document.getElementById('playAnswerAudio').play();
    }

    answering(event){
        let answers = this.state.answers;
        answers[parseFloat(event.target.name[0]) - 1] = event.target.name[1];

        this.setState({
            answers: answers
        });
    }

    async skip(){
        browserHistory.push('/home');
    }

    async componentDidMount() {
        //await CurrentUser.getUserId()
        try{
            let userId = await CurrentUser.getUserId();

            this.setState({
                userId: userId
            });
        }
        catch (ex){
            console.log(ex.toString());
        }
    }

    helpModalShow(){
        document.getElementById('help-modal').style.display = 'flex';
    }

    closeHelpModal(){
        document.getElementById('help-modal').style.display = 'none';
    }

    checkPlacementAnswer(){
        if(this.state.answers.length === 8){
            return true;
        }else{
            return false;
        }
    }

    async handleAudioChange(e) {
        try {
            let inputFile = (this.state.audioAnsweringStatus === true ? this.fileInputAgain : this.fileInput);

            console.log(inputFile.files[0].name);

            let qiniu_token = await  ServiceProxy.proxy('/qiniu/token', {
                method: 'GET'
            });

            if(!qiniu_token.uptoken){
                throw new Error(Resources.getInstance().avatarTokenWrong);
            }

            let fileForm = new FormData();

            fileForm.append("name", inputFile.files[0].name);
            fileForm.append("file", inputFile.files[0]);
            fileForm.append("token", qiniu_token.uptoken);

            let result = await ServiceProxy.proxy(qiniu_token.upload_url,{
                method: 'POST',
                body: fileForm,
                credentials: undefined,
                headers: undefined
            });

            if(!result.key || !result.hash){
                throw new Error(Resources.getInstance().avatarKeyWrong);
            }else{
                let clonedAnswers = this.state.answers;
                clonedAnswers.push(qiniu_token.resources_url + result.key);

                this.setState({
                    audioAnswerUrl: qiniu_token.resources_url + result.key,
                    audioAnsweringStatus: true,
                    answers: clonedAnswers
                });

                console.log('upload success');
                console.log(this.state);
            }

            this.setState({
                audioAnsweringStatus: true
            });
        } catch (ex) {
            console.error(ex);
        }
    };

    async submit(){
        try {
            console.log('step');
            console.log(this.state.step);
            console.log(this.state.answers);

            if(this.state.step < 8){
                let newStep = this.state.step +1;

                if(this.state.step === 7){
                    let answerSeventh = this.state.answers[6];

                    let audioUrl = answerSeventh === 'A ' ? 'http://p579tk2n2.bkt.clouddn.com/Placement%201.mp3' : (answerSeventh === 'B' ? 'http://p579tk2n2.bkt.clouddn.com/Placement%202.mp3' : 'http://p579tk2n2.bkt.clouddn.com/Placement%203.mp3');
                    let audioQuestionLength = answerSeventh === 'A ' ? 5 : (answerSeventh === 'B' ? 13 : 11);

                    this.setState({
                        step: newStep,
                        audioQuestionUrl: audioUrl,
                        audioQuestionLength: audioQuestionLength
                    });
                }else{
                    this.setState({
                        step: newStep
                    });
                }
            }else{
                //done
                document.getElementById('loadingModal').style.display = 'block';

                if(this.checkPlacementAnswer()){
                    let placementTestData = {
                        user_id: this.state.userId,
                        detail: JSON.stringify({
                            questions: this.state.questions,
                            answers: this.state.answers
                        })
                    };

                    console.log('已完成.........');
                    console.log(this.state.answers);

                    let response = await ServiceProxy.proxyTo({
                        body: {
                            uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                            json: placementTestData,
                            method: 'PUT'
                        }
                    });

                    document.getElementById('loadingModal').style.display = 'none';
                    browserHistory.push('/home');
                }else{
                    console.log('未完成.........');
                    console.log(this.state.answers);
                    document.getElementById('loadingModal').style.display = 'none';
                }

            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
            document.getElementById('loadingModal').style.display = 'none';
            browserHistory.push('/home');
        }
    }

    render() {
        return (
            <div className="my-profile">
                <Segment loading={true} id='loadingModal' style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888, display: 'none'}}>
                </Segment>
                <div className="header-with-go-back">
                    <div className="go-back" onClick={this.goBack}>
                        <div className="arrow-left">
                        </div>
                        <div className="circle-border">
                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""/>
                        </div>
                    </div>
                    <div className="logo">
                        <div>
                            <img src="http://resource.buzzbuzzenglish.com/new_buzz_logo.png"/>
                        </div>
                    </div>
                </div>
                <div className="profile-progress placement-test">
                    <div className={this.state.step > 1 ? 'done' : (this.state.step === 1 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>1</p>
                    </div>
                    <div className={this.state.step > 2 ? 'done' : (this.state.step === 2 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>2</p>
                    </div>
                    <div className={this.state.step > 3 ? 'done' : (this.state.step === 3 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>3</p>
                    </div>
                    <div className={this.state.step > 4 ? 'done' : (this.state.step === 4 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>4</p>
                    </div>
                    <div className={this.state.step > 5 ? 'done' : (this.state.step === 5 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>5</p>
                    </div>
                    <div className={this.state.step > 6 ? 'done' : (this.state.step === 6 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>6</p>
                    </div>
                    <div className={this.state.step > 7 ? 'done' : (this.state.step === 7 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>7</p>
                    </div>
                    <div className={this.state.step > 8 ? 'done' : (this.state.step === 8 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
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
                                        <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                    </div>
                                    <div className="first-title">
                                        <p>{this.state.questions[this.state.step-1].title}</p>
                                    </div>
                                </div>
                                <div className="first-answer">
                                    <div className="answer-title" style={{fontSize: '.8em'}}>选择最匹配的选项</div>
                                    {
                                        this.state.questions[this.state.step-1].items.map((item, index) => {
                                            return <div className="answer-item" key={index}
                                                style={this.state.answers[this.state.step-1] === (index === 0 ? 'A' : (index === 1 ? 'B' : 'C')) ? {color: 'rgb(246, 180, 12)', border: '1px solid rgb(246, 180, 12)'} : {}}  >
                                                <div className="item-value">
                                                    <p>{index === 0 ? 'A' : (index === 1 ? 'B' : 'C')}</p>
                                                </div>
                                                <div className="item-content">
                                                    <p>{item}</p>
                                                </div>
                                                <button className="click-event" name={this.state.step + '' + (index === 0 ? 'A' : (index === 1 ? 'B' : 'C'))} onClick={this.answering}>hidden</button>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>)
                            :
                            (
                                (<div className="placement-second">
                                    <div className="second-title">
                                        <p>Listen to the question and record an appropriate response.</p>
                                    </div>
                                    <div className="first-question">
                                        <div>
                                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                        </div>
                                        <div className="first-title" onClick={this.playQuestionVideo}>
                                            <p>点击收听</p>
                                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_recording.png" alt=""/>
                                            <audio id="playAnswerAudio" width="0" height="0" src={this.state.audioAnswerUrl || ''}>not support audio</audio>
                                            <audio id="playQuestionAudio" width="0" height="0" src={this.state.audioQuestionUrl || 'http://p579tk2n2.bkt.clouddn.com/Placement%201.mp3'} >not support audio</audio>
                                        </div>
                                        <p>{this.state.audioQuestionLength || 0}"</p>
                                    </div>
                                    <div className="answering-audio">
                                        <div className="first-title-answer">
                                            <img className="transform-img" src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_recording.png" alt=""/>
                                            <p>{this.state.audioAnsweringStatus === true ? '点击收听' : '点击录制你的回答'}</p>
                                            <div className="background-talk">
                                                <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/audio_talk.png" alt=""/>
                                            </div>
                                            <input type="file" id="audio-answer" accept="audio/*"
                                                   onChange={(e) => this.handleAudioChange(e)}
                                                   ref={input => {
                                                       this.fileInput = input;
                                                   }} />
                                            <div className="hasRecorded" style={this.state.audioAnsweringStatus === true ? {display: 'block'} : {display: 'none'}}
                                            onClick={this.playRecordedVideo} >
                                            </div>
                                        </div>
                                        <div>
                                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                        </div>
                                    </div>
                                    <div className="recordAgain">
                                        <p className="placement-audio-record-again">{this.state.audioAnsweringStatus ? '点击重录' : '查看录音操作帮助'}</p>
                                        <input type="file" id="audio-answer-again" accept="audio/*"  style={this.state.audioAnsweringStatus === true ? {} : {display: 'none'}}
                                               onChange={(e) => this.handleAudioChange(e)}
                                               ref={input => {
                                                   this.fileInputAgain = input;
                                               }} />
                                        <a onClick={this.helpModalShow} style={this.state.audioAnsweringStatus === true ? {display: 'none'} : {}} />
                                    </div>
                                </div>)
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='Continue'  style={this.state.answers[this.state.step - 1] === undefined ? {margin: '2em auto .5em auto', width: '100%', color: 'rgb(255, 255, 255)', height: '4em', fontWeight: 'normal', borderRadius: '30px', backgroundColor: 'rgb(223,223,238)'} : {margin: '2em auto .5em auto', width: '100%', color: 'rgb(255, 255, 255)', background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))', height: '4em', fontWeight: 'normal', borderRadius: '30px'}} disabled={this.state.answers[this.state.step - 1] === undefined} onClick={this.submit} />
                    </Form.Group>
                </Form>
                <br/>
                <div id="help-modal" className="help-modal">
                    <div className="class-detail-header">
                        <div className="arrow">
                            <img style={{width: '20px'}}
                                 src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                                 onClick={this.closeHelpModal}/>
                        </div>
                        <div className="class-detail-title">录音使用帮助</div>
                        <div className="class-order">

                        </div>
                    </div>
                    <div className="help-content">
                        <img src="//p579tk2n2.bkt.clouddn.com/placement-help.png" alt=""/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Homepage;