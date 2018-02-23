import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            tab: 'booking',
            booking: [
                {
                    status: 1,
                    date: '2018-2-1',
                    time: '9:00-11:00',
                    topic: ''
                },
                {
                    status: 2,
                    date: '2018-2-1',
                    time: '18:00-19:00',
                    topic: 'sing a new song'
                },
                {
                    status: 3,
                    date: '2018-2-1',
                    time: '18:00-19:00',
                    topic: 'sing a new song'
                }
            ]
        };

        this.tabChangeBook = this.tabChangeBook.bind(this);
        this.tabChangeMessage = this.tabChangeMessage.bind(this);
    }

    tabChangeBook(){
        let tab = this.state.tab;

        if(tab !== 'booking'){
            this.setState({
                tab: 'booking'
            });
        }
    }

    tabChangeMessage(){
        let tab = this.state.tab;

        if(tab !== 'message'){
            this.setState({
                tab: 'message'
            });
        }
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="my-home">
                <div className="home-header">
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}} onClick={this.tabChangeBook}>
                        <Icon name="object group" />
                        <span>booking</span>
                        <div className="tab-active"  style={this.state.tab === 'booking' ? {border: '1px solid #f7b52a'} : {}}></div>
                    </div>
                    <div className="tab-message" style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}} onClick={this.tabChangeMessage}>
                        <Icon name="mail" />
                        <span>message</span>
                        <div className="tab-active" style={this.state.tab === 'message' ? {border: '1px solid #f7b52a'} : {}}></div>
                    </div>
                    <div className="consult">
                        <Icon name="wechat" />
                    </div>
                </div>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <div className="booking-item" key={index} >
                                            <div className="booking-item-avatar">
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                            <div className="booking-item-info">
                                                <p className="your-name" style={{fontWeight: 'bold', fontSize: '1.2em'}}>SEAN</p>
                                                <p className="class-topic" style={{color: '#f7b52a', margin: '.3em 0'}}>sing a New song</p>
                                                <p className="class-date" style={{fontSize: '.8em', color: '#aaa'}}>Today, Friday 29 December</p>
                                                <p className="class-time" style={{fontSize: '.8em', color: '#aaa'}}>11:00 - 12:00</p>
                                            </div>
                                            <div className="booking-item-status">
                                                <p style={item.status === 1 ? {color: 'red'} : (item.status === 2 ? {color: 'rgb(106, 225, 8)'} : {color: '#aaa'})}>{item.status === 1 ? '待确认' : (item.status === 2 ? '7天后' : '已结束')}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>) :
                            (<div className="none-items">
                                <div className="no-items">
                                    <p>你还没开始预约课程</p>
                                    <p>马上开始预约吧</p>
                                    <p>与全球伙伴用英文交流</p>
                                </div>
                            </div>)}
                        <div className="booking-btn">
                            <Form.Group widths='equal'>
                                <Form.Field control={Button} onClick={this.signUp}
                                            content='预约'/>
                            </Form.Group>
                        </div>
                    </div>) :
                    (<div className="home-content">
                        <div className="message-tab">
                            <div className="message-friends">
                                <p>Friends(10)</p>
                            </div>
                            <div className="message-advisor active">
                                <p>Advisor(10+)</p>
                            </div>
                        </div>
                        <div className="message-content">
                            <div className="friend-message-items">
                                <div></div>
                            </div>
                            <div className="advisor-message-items"></div>
                        </div>
                    </div>)
                }
                <div className="offset-footer"></div>
                <Footer />
            </div>
        );
    }
}

export default Home;