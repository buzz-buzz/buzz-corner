import React, {Component} from 'react';
import {Form, Button, Icon, Segment} from 'semantic-ui-react';
import {Link} from "react-router";
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import Welcome from '../common/commonComponent/modalWelcome/index';
import './index.css';

class Home extends Component {
    constructor() {
        super();

        this.state = {
            tab: 'booking',
            booking: [],
            message_tab: 'advisor',
            messageFromAdvisor: [],
            messageRead: false
        };

        this.tabChangeBook = this.tabChangeBook.bind(this);
        this.tabChangeMessage = this.tabChangeMessage.bind(this);
        this.messageTabChangeFriends = this.messageTabChangeFriends.bind(this);
        this.messageTabChangeAdvisor = this.messageTabChangeAdvisor.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    signUp() {
        browserHistory.push('/consult');
    }

    tabChangeBook() {
        let tab = this.state.tab;

        if (tab !== 'booking') {
            this.setState({
                tab: 'booking'
            });
        }
    }

    tabChangeMessage() {
        let tab = this.state.tab;

        if (tab !== 'message') {
            this.setState({
                tab: 'message'
            });
        }
    }

    messageTabChangeFriends() {
        let tabIndex = this.state.message_tab;

        if (tabIndex !== 'friends') {
            this.setState({
                message_tab: 'friends'
            });
        }
    }

    messageTabChangeAdvisor() {
        let tabIndex = this.state.message_tab;

        if (tabIndex !== 'advisor') {
            this.setState({
                message_tab: 'advisor'
            });
        }
    }

    async getPlacementResult(user_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${user_id}`
            }
        });
    }

    async getUserClassList(user_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/student-class-schedule/${user_id}`
            }
        });
    }

    transformDay(day) {
        switch (day) {
            case 1:
                return 'Monday';
                break;
            case 2:
                return 'Tuesday';
                break;
            case 3:
                return 'Wednesday';
                break;
            case 4:
                return 'Thursday';
                break;
            case 5:
                return 'Friday';
                break;
            case 6:
                return 'Saturday';
                break;
            case 0:
                return 'Sunday';
                break;
            default :
                break;
        }
    }

    transformMonth(day) {
        switch (day) {
            case 0:
                return 'January';
                break;
            case 1:
                return 'February';
                break;
            case 2:
                return 'March';
                break;
            case 3:
                return 'April';
                break;
            case 4:
                return 'May';
                break;
            case 5:
                return 'June';
                break;
            case 6:
                return 'July';
                break;
            case 7:
                return 'August';
                break;
            case 8:
                return 'September';
                break;
            case 9:
                return 'October';
                break;
            case 10:
                return 'November';
                break;
            case 11:
                return 'December';
                break;
            default :
                break;
        }
    }

    handleClassListData(classList) {

        if (classList && classList.length > 0) {
            for (let i in classList) {
                let dateClone = new Date(classList[i].start_time);

                let leftDays = this.calcDaysFromNow(classList[i].start_time);

                classList[i].show_date = this.transformDay(dateClone.getDay()) + ', '
                    + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth()) + ', ' + new Date(classList[i].end_time).getFullYear();
                classList[i].show_time = (dateClone.getHours() > 9 ? dateClone.getHours() : '0' + dateClone.getHours()) + ':'
                    + (dateClone.getMinutes() > 9 ? dateClone.getMinutes() : '0' + dateClone.getMinutes()) + ' - '
                    + (new Date(classList[i].end_time).getHours() > 9 ? new Date(classList[i].end_time).getHours() : '0' + new Date(classList[i].end_time).getHours() ) + ' : '
                    + (new Date(classList[i].end_time).getMinutes() > 9 ? new Date(classList[i].end_time).getMinutes() : '0' + new Date(classList[i].end_time).getMinutes() );

                classList[i].class_status_show_style = leftDays >= 1 ? 'rgb(0, 216, 90)' : (dateClone - new Date() > 0 ? 'rgb(0, 216, 90)' : ( new Date(classList[i].end_time) - new Date() > 0 ? 'rgb(246, 180, 12)' : 'rgb(102， 102， 102)' ));
                classList[i].class_status_show_word = leftDays >= 1 ? leftDays + '天后开始' : (dateClone - new Date() > 0  ? '今天开始' : ( new Date(classList[i].end_time) - new Date() > 0 ?  '已开始' : '已结束' ));
            }
        }

        return classList;
    }

    calcDaysFromNow(date) {
        let theDate = new Date(new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1 ) + '-' + new Date(date).getDate());

        let nowDate = new Date(new Date().getFullYear() + '-' + ( new Date().getMonth() + 1) + '-' + new Date().getDate());

        return parseInt((theDate - nowDate) / (1000 * 3600 * 24));
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'block';

            //check if placement is Done await CurrentUser.getUserId()
            let userId = await CurrentUser.getUserId();

            let placementResult = await this.getPlacementResult(userId);

            let classList = await this.getUserClassList(userId);

            classList = classList.filter(function (ele) {
                return ele.status && ele.status !== 'cancelled' && ele.class_id;
            });

            classList = this.handleClassListData(classList);

            console.log(classList);

            let clonedMessageFromAdvisor = this.state.messageFromAdvisor;

            if (!placementResult || !placementResult.detail || placementResult.detail.length < 20) {

                clonedMessageFromAdvisor.push({
                    message_title: '建立能力档案',
                    message_content: '请建立能力档案，完成后可以为你安排更合适的课程。',
                    message_avatar: '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                    goUrl: '/placement',
                    hasRead: ''
                });
            }

            classList.map((item, index) => {
                if (item.end_time && new Date(item.end_time) - new Date() < 0 && !item.comment && !item.score) {
                    clonedMessageFromAdvisor.push({
                        message_title: item.companion_name || 'Advisor',
                        message_content: '课程结束了，给课程\"' + (item.topic || item.name || 'No topic') + '\"来一个评价吧。',
                        message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                        goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id,
                        hasRead: ''
                    });
                }else if(item.end_time && new Date(item.end_time) - new Date() < 0 && item.comment && item.score){
                    clonedMessageFromAdvisor.push({
                        message_title: item.companion_name || 'Advisor',
                        message_content: '已完成课程\"' + (item.topic || item.name || 'No topic') + '\"的评价，点击查看。',
                        message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                        goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id,
                        hasRead: 'read'
                    });
                }
            });

            let messageCheck = clonedMessageFromAdvisor.filter(function(item){
                return item.hasRead !== 'read';
            });

            this.setState({
                messageFromAdvisor: clonedMessageFromAdvisor,
                booking: classList,
                messageRead: messageCheck.length > 0
            });

            //class_list --->  feedback list

        } catch (ex) {
            console.log('login failed: ' + ex.toString());
        } finally {
            //console.log('login failed');
            if (document.getElementById('loadingModal')) {
                document.getElementById('loadingModal').style.display = 'none';
            }

        }
    }

    render() {
        return (
            <div className="my-home">
                <Welcome />
                <div className="home-header">
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeBook}>
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_booking.png" alt="" style={{
                            height: '50%',
                            marginRight: '.5em'
                        }}/>
                        <span>课程预约</span>
                        <div className="tab-active"
                             style={this.state.tab === 'booking' ? {border: '1px solid #f7b52a'} : {}}></div>
                    </div>
                    <div className="tab-message" style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeMessage}>
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_message.png" alt="" style={{
                            height: '40%',
                            marginRight: '.5em'
                        }}/>
                        <span>消息通知</span>
                        <div className="tab-active"
                             style={this.state.tab === 'message' ? {border: '1px solid #f7b52a'} : {}}></div>
                        <div className="message-red-circle"
                             style={this.state.messageRead ? {} : {display: 'none'}}></div>
                    </div>
                    <Link className="consult" to="consult">
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_consult.png" alt=""/>
                    </Link>
                </div>
                <Segment loading={true} id='loadingModal' style={{
                    border: 'none',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 888,
                    display: 'none'
                }}>
                </Segment>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index} to={"class/" + item.class_id}>
                                            <div className="booking-item-avatar">
                                                <img
                                                    src={item.companion_avatar || '//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd'}
                                                    alt=""/>
                                            </div>
                                            <div className="booking-item-info">
                                                <p className="your-name" style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1.2em',
                                                    color: '#111'
                                                }}>{item.companion_name || 'BuzzBuzz'}</p>
                                                <p className="class-topic" style={{
                                                    color: '#f7b52a',
                                                    margin: '.3em 0'
                                                }}>{item.topic || 'No topic'}</p>
                                                <p className="class-date"
                                                   style={{fontSize: '.8em', color: '#aaa'}}>{item.show_date}</p>
                                                <p className="class-time"
                                                   style={{fontSize: '.8em', color: '#aaa'}}>{item.show_time}</p>
                                            </div>
                                            <div className="booking-item-status">
                                                <p style={{color: item.class_status_show_style}}>{item.class_status_show_word}</p>
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
                    </div>) :
                    (<div className="home-content">
                        <div className="message-tab">
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'friends') ? 'message-friends active' : 'message-friends'}
                                onClick={this.messageTabChangeFriends}>
                                <p>伙伴</p>
                            </div>
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'advisor') ? 'message-advisor active' : 'message-advisor'}
                                onClick={this.messageTabChangeAdvisor}>
                                <p>{'助教' + (this.state.messageFromAdvisor.length > 0 ? '(' + this.state.messageFromAdvisor.length + ')' : '')}</p>
                                <div className="message-red-circle"
                                     style={this.state.messageRead ? {} : {display: 'none'}}></div>
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                </div>) :
                                (this.state.messageFromAdvisor.length === 0 ?
                                    (<div className="none-items">
                                            <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                        </div>
                                    ) :
                                    (<div className="message-items">
                                            {
                                                this.state.messageFromAdvisor.map((item, index) => {
                                                    return <Link className="message-item" key={index} to={item.goUrl}>
                                                        <div className="message-item-avatar">
                                                            <div className="message-red-circle"
                                                                 style={item.hasRead === 'read' ? {display: 'none'} : {display: 'block'}}></div>
                                                            <img src={item.message_avatar} alt=""/>
                                                        </div>
                                                        <div className="message-body">
                                                            <div className="message-title">{item.message_title}</div>
                                                            <div
                                                                className="message-content">{item.message_content}</div>
                                                        </div>
                                                    </Link>
                                                })
                                            }
                                        </div>
                                    ))
                        }
                    </div>)
                }
                <div className="booking-btn">
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} onClick={this.signUp}
                                    content='预约'/>
                    </Form.Group>
                </div>
                <div className="offset-footer"></div>
                <Footer />
            </div>
        );
    }
}

export default Home;