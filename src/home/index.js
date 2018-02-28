import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import {Link} from "react-router";
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import './index.css';


function getBirthDay(date_of_birth) {
    if (date_of_birth) {
        let date = new Date(date_of_birth);
        return  String(date.getFullYear()) + '-' + String(date.getMonth() + 1 >9?date.getMonth() + 1:'0'+(date.getMonth() + 1)) + '-' + String(date.getDate()>9?date.getDate():'0'+date.getDate());
    } else {
        return ''
    }
}

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
                    topic: '',
                    class_id: 1
                },
                {
                    status: 2,
                    date: '2018-2-1',
                    time: '18:00-19:00',
                    topic: 'sing a new song',
                    class_id: 2
                },
                {
                    status: 3,
                    date: '2018-2-1',
                    time: '18:00-19:00',
                    topic: 'sing a new song',
                    class_id: 3
                }
            ],
            message_tab: 'friends'
        };

        this.tabChangeBook = this.tabChangeBook.bind(this);
        this.tabChangeMessage = this.tabChangeMessage.bind(this);
        this.messageTabChangeFriends = this.messageTabChangeFriends.bind(this);
        this.messageTabChangeAdvisor = this.messageTabChangeAdvisor.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    signUp(){
       browserHistory.push('/consult');
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

    messageTabChangeFriends(){
        let tabIndex = this.state.message_tab;

        if(tabIndex !== 'friends'){
            this.setState({
                message_tab: 'friends'
            });
        }
    }

    messageTabChangeAdvisor(){
        let tabIndex = this.state.message_tab;

        if(tabIndex !== 'advisor'){
            this.setState({
                message_tab: 'advisor'
            });
        }
    }

    async componentDidMount() {

        //await CurrentUser.getUserId();
        let userId = await CurrentUser.getUserId();

        let profile = (await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/${userId}`
            }
        }));

        console.log(profile);

        if(!profile.date_of_birth || !profile.location){
            browserHistory.push('/my/info');
        }

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
                    <Link className="consult" to="consult">
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_consult.png" alt=""/>
                    </Link>
                </div>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index} to={"class/" + item.class_id}>
                                            <div className="booking-item-avatar">
                                                <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                            </div>
                                            <div className="booking-item-info">
                                                <p className="your-name" style={{fontWeight: 'bold', fontSize: '1.2em', color: '#111'}}>SEAN</p>
                                                <p className="class-topic" style={{color: '#f7b52a', margin: '.3em 0'}}>Sing a New song</p>
                                                <p className="class-date" style={{fontSize: '.8em', color: '#aaa'}}>Today, Friday 29 December</p>
                                                <p className="class-time" style={{fontSize: '.8em', color: '#aaa'}}>11:00 - 12:00</p>
                                            </div>
                                            <div className="booking-item-status">
                                                <p style={item.status === 1 ? {color: 'red'} : (item.status === 2 ? {color: 'rgb(106, 225, 8)'} : {color: '#aaa'})}>{item.status === 1 ? '待确认' : (item.status === 2 ? '7天后' : '已结束')}</p>
                                            </div>
                                        </Link>
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
                            <div className={(this.state.tab === 'message' && this.state.message_tab === 'friends') ? 'message-friends active' : 'message-friends'} onClick={this.messageTabChangeFriends}>
                                <p>Friends(10)</p>
                            </div>
                            <div className={(this.state.tab === 'message' && this.state.message_tab === 'advisor') ? 'message-advisor active' : 'message-advisor'} onClick={this.messageTabChangeAdvisor}>
                                <p>Advisor(10+)</p>
                            </div>
                        </div>
                        <div className="message-content">
                            {
                                this.state.message_tab === 'friends' ?
                                    (<div className="friend-message-items">
                                        <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                    </div>) :
                                    (<div className="advisor-message-items">
                                        <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                    </div>)
                            }
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