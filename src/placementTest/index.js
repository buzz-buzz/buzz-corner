import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
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
                    'Yes, I can.df dfgdfgfdg dfgdfgfdg dfg dfgd dfg dgdf gd dfg ddg dfg dgd fgdfg',
                    'No, I can\'t',
                    'Oh, sorry...'
                ]
            },
            firstAnswer: ''
        };

        this.answering = this.answering.bind(this);
    }

    answering(event){
        this.setState({
            firstAnswer: event.target.name
        });
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
                            (<div className="first">
                                <div className="first-question">
                                    <div>
                                        <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                    </div>
                                    <p className="first-title">
                                        Do you know how to introduce yourself in English?
                                    </p>
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
                            (<div></div>)
                    }
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} content='Continue'  style={{margin: '2em auto .5em auto', width: '100%', color: 'rgba(0,0,0,.6)', backgroundColor: '#f7b52a', height: '4em', fontWeight: 'normal', borderRadius: '30px'}} disabled={this.state.firstAnswer === ''} onClick={this.submit} />
                    </Form.Group>
                    <div className="skip">Skip and setup later</div>
                </Form>
                <br/>
            </div>
        );
    }
}

export default Homepage;