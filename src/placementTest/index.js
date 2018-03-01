import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
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
                    title: '对没准备的话题, 仍然愿意用英语沟通.',
                    items: [
                    '不愿意.',
                    '无所谓',
                    '愿意'
                    ]
                },
                {
                    title: '对于小伙伴是否能听懂我的英语，我',
                    items: [
                        '很担心.',
                        '无所谓',
                        '不担心'
                    ]
                },
                {
                    title: '以下情况，你属于哪一种',
                    items: [
                        '需要翻译听懂常用指令,能简短介绍个人和兴趣爱好',
                        '能听懂常用指令并做出反应，能清楚地介绍自己，能简单描述一件事',
                        '能比较有条理地描述个人体验和表达个人想法，能与伙伴进行几个回合的交谈'
                    ]
                }
             ],
            firstAnswer: '',
            answers: [],
            audioAnsweringStatus: false
        };

        this.answering = this.answering.bind(this);
        this.skip = this.skip.bind(this);
        this.submit = this.submit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.listenAudio = this.listenAudio.bind(this);
        this.recordAudio = this.recordAudio.bind(this);
    }

    goBack(){
        if(this.state.step === 1){
            window.history.back();
        }else if(this.state.step <= 4){
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    listenAudio(){

    }

    recordAudio(){

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
        let userId = 21;

        this.setState({
            userId: userId
        });
    }

    checkPlacementAnswer(){
        if(this.state.answers.length === 4){
            return true;
        }else{
            return false;
        }
    }

    async handleAudioChange(e) {
        try {
            console.log(this.fileInput.files[0].name);

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

            if(this.state.step < 4){
                let newStep = this.state.step +1;
                this.setState({
                    step: newStep
                });
            }else{
                //done
                if(this.checkPlacementAnswer()){
                    console.log(this.state.answers);
                    //saveData to DB

                    let placementTestData = {
                        user_id: this.state.userId,
                        detail: JSON.stringify({
                            questions: this.state.questions,
                            answers: this.state.answers
                        })
                    };

                    //browserHistory.push('/home');

                    console.log('已完成.........');
                    console.log(this.state.answers);

                    // let response = await ServiceProxy.proxyTo({
                    //     body: {
                    //         uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${this.state.userId}`,
                    //         json: placementTestData,
                    //         method: 'PUT'
                    //     }
                    // });
                    //
                    // browserHistory.push('/home');
                }else{
                    console.log('未完成.........');
                    console.log(this.state.answers);
                }

            }

            //this.setState({modal: true, message: Resources.getInstance().saveSuccess});
        } catch (ex) {
            console.error(ex);
            //this.setState({modal: true, message: ex.message || Resources.getInstance().saveFailed});
        }
    }

    render() {
        return (
            <div className="my-profile">
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
                <div className="profile-progress">
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
                </div>
                <Form className='profile-body'>
                    {
                        this.state.step <= 3 ?
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
                                    <div className="answer-title">选择最匹配的选项</div>
                                    {
                                        this.state.questions[this.state.step-1].items.map((item, index) => {
                                            return <div className="answer-item" key={index}
                                                style={this.state.answers[this.state.step-1] === (index === 0 ? 'A' : (index === 1 ? 'B' : 'C')) ? {background: '#f7b52a', color: 'white', border: '1px solid #f7b52a'} : {}}  >
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
                                        <div className="first-title" onClick={this.listenAudio}>
                                            <p>点击收听</p>
                                            <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_recording.png" alt=""/>
                                            <audio src="">not support audio</audio>
                                        </div>
                                        <p>60"</p>
                                    </div>
                                    <div className="answering-audio">
                                        <div className="first-title-answer"  onClick={this.recordAudio}>
                                            <img className="transform-img" src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_recording.png" alt=""/>
                                            <p>{this.state.audioAnsweringStatus === true ? '已完成' : '点击录制你的回答'}</p>
                                            <div className="background-talk">
                                                <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/audio_talk.png" alt=""/>
                                            </div>
                                            <input type="file" id="audio-answer" accept="audio/*"
                                                   onChange={(e) => this.handleAudioChange(e)}
                                                   ref={input => {
                                                       this.fileInput = input;
                                                   }} />
                                        </div>
                                        <div>
                                            <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                        </div>
                                    </div>
                                    <p className="placement-audio-record-again">{this.state.audioAnsweringStatus ? '再次点击重录' : ''}</p>
                                </div>)
                            )
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='Continue'  style={this.state.answers[this.state.step - 1] === undefined ? {margin: '2em auto .5em auto', width: '100%', color: 'rgba(0,0,0,.6)', height: '4em', fontWeight: 'normal', borderRadius: '30px'} : {margin: '2em auto .5em auto', width: '100%', color: 'rgba(0,0,0,.6)', background: 'linear-gradient(to right, rgb(251, 218, 97) , rgb(246, 180, 12))', height: '4em', fontWeight: 'normal', borderRadius: '30px'}} disabled={this.state.answers[this.state.step - 1] === undefined} onClick={this.submit} />
                    </Form.Group>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;