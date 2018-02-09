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
            questions: {
                title: 'Do you know how to introduce yourself in English?',
                items: [
                    'Yes, I can introduce myself with a full sentence.',
                    'No, I can\'t',
                    'Oh, sorry...'
                ]
            },
            firstAnswer: ''
        };

        this.answering = this.answering.bind(this);
        this.skip = this.skip.bind(this);
        this.submit = this.submit.bind(this);
        this.goBack = this.goBack.bind(this);
    }

    goBack(){
        if(this.state.step === 1){
            browserHistory.push('/');
        }else if(this.state.step <= 4){
            let newStep = this.state.step - 1;
            this.setState({
                step: newStep
            });
        }
    }

    answering(event){
        this.setState({
            firstAnswer: event.target.name
        });
    }

    async skip(){
        browserHistory.push('/');
    }

    async componentDidMount() {
        let userId = await CurrentUser.getUserId();

        this.setState({
            userId: userId
        });
    }

    async submit(){
        try {
            if(this.state.step < 4){
                let newStep = this.state.step +1;
                this.setState({
                    step: newStep
                });
            }else{
                //done
                console.log('用户placement填写完毕');
                console.log(this.state);
                //saveData to DB

                let placementTestData = {
                    user_id: this.state.userId,
                    test_time: new Date(),
                    placement_content: '{"question":"how old are you?";"answer":"I am 18."}',
                    remark: ''
                };

                console.log(placementTestData);

                // let response = await ServiceProxy.proxyTo({
                //     body: {
                //         uri: `{config.endPoints.buzzService}/api/v1/placement-test/${this.state.userId}`,
                //         json: placementTestData,
                //         method: 'POST'
                //     }
                // });
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
                            <Icon className='arrow left'  />
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
                        <p>First</p>
                    </div>
                    <div className={this.state.step > 2 ? 'done' : (this.state.step === 2 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>Second</p>
                    </div>
                    <div className={this.state.step > 3 ? 'done' : (this.state.step === 3 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>Third</p>
                    </div>
                    <div className={this.state.step > 4 ? 'done' : (this.state.step === 4 ?  'active' : '' )}>
                        <div className="dot">
                            <div className="line-left"></div>
                            <div className="circle"></div>
                        </div>
                        <p>Fourth</p>
                    </div>
                </div>
                <Form className='profile-body'>
                    {
                        this.state.step === 1 ?
                            (<div className="first placement-first">
                                <div className="first-question">
                                    <div>
                                        <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                    </div>
                                    <div className="first-title">
                                        <p>{this.state.questions.title}</p>
                                    </div>
                                </div>
                                <div className="first-answer">
                                    <div className="answer-title">Select the best matching answer.</div>
                                    {
                                        this.state.questions.items.map((item, index) => {
                                            return <div className="answer-item" key={index}
                                                style={this.state.firstAnswer === index + '' ? {background: '#f7b52a', color: 'white', border: '1px solid #f7b52a'} : {}}  >
                                                <div className="item-value">
                                                    <p>{index === 0 ? 'A' : (index === 1 ? 'B' : 'C')}</p>
                                                </div>
                                                <div className="item-content">
                                                    <p>{item}</p>
                                                </div>
                                                <button className="click-event" name={index} onClick={this.answering}>hidden</button>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>)
                            :
                            (this.state.step === 2 ? (
                                    <div className="placement-second">
                                        <div className="second-title">
                                            <p>Listen to the question and record an appropriate response.</p>
                                        </div>
                                        <div className="first-question">
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                            <div className="first-title">
                                                <p>点击收听</p>
                                            </div>
                                        </div>
                                        <div className="answering-audio">
                                            <div className="first-title">
                                                <p>点击回答</p>
                                            </div>
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                        </div>
                                    </div>
                                ) : (this.state.step === 3 ? (
                                        <div className="placement-second">
                                            <div className="second-title">
                                                <p>Listen to the question and record an appropriate response.</p>
                                            </div>
                                            <div className="first-question">
                                                <div>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                                <div className="first-title">
                                                    <p>点击收听</p>
                                                </div>
                                            </div>
                                            <div className="answering-audio">
                                                <div className="first-title">
                                                    <p>点击回答</p>
                                                </div>
                                                <div>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                            </div>
                                            <div className="first-question">
                                                <div>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                                <div className="first-title">
                                                    <p>点击收听</p>
                                                </div>
                                            </div>
                                            <div className="answering-audio">
                                                <div className="first-title">
                                                    <p>点击回答</p>
                                                </div>
                                                <div>
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (<div className="placement-second">
                                        <div className="second-title">
                                            <p>Listen to the question and record an appropriate response.</p>
                                        </div>
                                        <div className="first-question">
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                            <div className="first-title">
                                                <p>点击收听</p>
                                            </div>
                                        </div>
                                        <div className="answering-audio">
                                            <div className="first-title">
                                                <p>点击回答</p>
                                            </div>
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                        </div>
                                        <div className="first-question">
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                            <div className="first-title">
                                                <p>点击收听</p>
                                            </div>
                                        </div>
                                        <div className="answering-audio">
                                            <div className="first-title">
                                                <p>点击回答</p>
                                            </div>
                                            <div>
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                        </div>
                                    </div>)))
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='Continue'  style={{margin: '2em auto .5em auto', width: '100%', color: 'rgba(0,0,0,.6)', backgroundColor: '#f7b52a', height: '4em', fontWeight: 'normal', borderRadius: '30px'}} disabled={this.state.firstAnswer === ''} onClick={this.submit} />
                    </Form.Group>
                    <div className="skip" onClick={this.skip} >Skip and setup later</div>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;