import React, {Component} from 'react';
import {Button, Form} from 'semantic-ui-react';
import {browserHistory, Link} from "react-router";
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import Footer from '../layout/footer';
import Welcome from '../common/commonComponent/modalWelcome';
import LoadingModal from '../common/commonComponent/loadingModal';
import Track from "../common/track";
import './index.css';
import * as timeHelper from "../common/timeHelper";

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
        this.clickEvent = this.clickEvent.bind(this);
        this.clickEventClassDetail = this.clickEventClassDetail.bind(this);
    }

    signUp() {
        Track.event('首页', '预约点击');

        browserHistory.push('/consult');
    }

    clickEvent(e, item) {
        let redStatus = item.hasRead === '' ?  '未读' : '已读';

        Track.event('首页', '消息点击', {'消息状态': redStatus, '消息类型': '助教'});
    }

    clickEventClassDetail(e, item) {
        Track.event('首页', '课程点击', {'课程状态': item.class_status_show_word || ''});
    }

    tabChangeBook() {
        Track.event('首页', '预约Tab点击');

        let tab = this.state.tab;

        if (tab !== 'booking') {
            this.setState({
                tab: 'booking'
            });
        }
    }

    tabChangeMessage() {
        Track.event('首页', '消息Tab点击');

        let tab = this.state.tab;

        if (tab !== 'message') {
            this.setState({
                tab: 'message'
            });
        }
    }

    messageTabChangeFriends() {
        Track.event('首页', '消息Tab切换为好友');

        let tabIndex = this.state.message_tab;

        if (tabIndex !== 'friends') {
            this.setState({
                message_tab: 'friends'
            });
        }
    }

    messageTabChangeAdvisor() {
        Track.event('首页', '消息Tab切换为助教');

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
        return timeHelper.getWeekdayNameByIndex(day);
    }

    transformMonth(day) {
        return timeHelper.getMonthNameByIndex(day);
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
                classList[i].class_status_show_word = leftDays >= 1 ? leftDays + '天后开始' : (dateClone - new Date() > 0 ? '今天开始' : ( new Date(classList[i].end_time) - new Date() > 0 ? '已开始' : '已结束' ));
            }
        }

        return classList;
    }

    calcDaysFromNow(date) {
        let theDate = new Date(new Date(date).getFullYear() + '-' + (new Date(date).getMonth() + 1 ) + '-' + new Date(date).getDate());

        let nowDate = new Date(new Date().getFullYear() + '-' + ( new Date().getMonth() + 1) + '-' + new Date().getDate());

        return Math.round((theDate - nowDate) / (1000 * 3600 * 24));
    }

    async componentDidMount() {
        try {
            Track.event('首页', '首页Home页面');

            this.setState({loadingModal: true});

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
                    message_title: Resources.getInstance().bookingPlacementInfoTitle,
                    message_content: Resources.getInstance().bookingPlacementInfoContent,
                    message_avatar: '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                    goUrl: '/placement',
                    hasRead: ''
                });
            }

            classList.map((item, index) => {
                if (item.end_time && new Date(item.end_time) - new Date() < 0 && !item.comment && !item.score) {
                    clonedMessageFromAdvisor.push({
                        message_title: item.companion_name || 'Advisor',
                        message_content: Resources.getInstance().bookingFeedbackNotice + (item.topic || item.name || 'No topic'),
                        message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                        goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id,
                        hasRead: ''
                    });
                } else if (item.end_time && new Date(item.end_time) - new Date() < 0 && item.comment && item.score) {
                    clonedMessageFromAdvisor.push({
                        message_title: item.companion_name || 'Advisor',
                        message_content: Resources.getInstance().bookingFeedbackInfo + (item.topic || item.name || 'No topic'),
                        message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                        goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id,
                        hasRead: 'read'
                    });
                }

                return item;
            });

            let messageCheck = clonedMessageFromAdvisor.filter(function (item) {
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
            Track.event('错误', '首页错误' + ex.toString());
        } finally {
            this.setState({loadingModal: false});
        }
    }

    render() {
        return (
            <div className="my-home">
                <Welcome/>
                <div className="home-header">
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeBook}>
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_booking.png" alt="" style={{
                            height: '50%',
                            marginRight: '.5em'
                        }}/>
                        <span>{Resources.getInstance().homeTabBooking}</span>
                        <div className="tab-active"
                             style={this.state.tab === 'booking' ? {border: '1px solid #f7b52a'} : {}}></div>
                    </div>
                    <div className="tab-message" style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeMessage}>
                        <img src="//p579tk2n2.bkt.clouddn.com/icon_message.png" alt="" style={{
                            height: '40%',
                            marginRight: '.5em'
                        }}/>
                        <span>{Resources.getInstance().homeTabMessage}</span>
                        <div className="tab-active"
                             style={this.state.tab === 'message' ? {border: '1px solid #f7b52a'} : {}}></div>
                        <div className="message-red-circle"
                             style={this.state.messageRead ? {} : {display: 'none'}}></div>
                    </div>
                    <Link className="consult" to="consult">
                        <img src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_consult.png" alt=""/>
                    </Link>
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index} to={"class/" + item.class_id}
                                                     onClick={event => this.clickEventClassDetail(event, item)}>
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
                                    <img src="//p579tk2n2.bkt.clouddn.com/icon_Coursepurchase tips.png" alt=""/>
                                    <p>{Resources.getInstance().bookingNoItemText1}</p>
                                    <p>{Resources.getInstance().bookingNoItemText2}</p>
                                    <p>{Resources.getInstance().bookingNoItemText3}</p>
                                </div>
                            </div>)}
                    </div>) :
                    (<div className="home-content">
                        <div className="message-tab">
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'friends') ? 'message-friends active' : 'message-friends'}
                                onClick={this.messageTabChangeFriends}>
                                <p>{Resources.getInstance().homeTabFriends}</p>
                            </div>
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'advisor') ? 'message-advisor active' : 'message-advisor'}
                                onClick={this.messageTabChangeAdvisor}>
                                <p>{Resources.getInstance().homeTabAdvisor + (this.state.messageFromAdvisor.length > 0 ? '(' + this.state.messageFromAdvisor.length + ')' : '')}</p>
                                <div className="message-red-circle"
                                     style={this.state.messageRead ? {} : {display: 'none'}}></div>
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <p style={{color: 'rgb(170, 170, 170)'}}>{Resources.getInstance().bookingNoMessage}</p>
                                </div>) :
                                (this.state.messageFromAdvisor.length === 0 ?
                                    (<div className="none-items">
                                            <p style={{color: 'rgb(170, 170, 170)'}}>{Resources.getInstance().bookingNoMessage}</p>
                                        </div>
                                    ) :
                                    (<div className="message-items">
                                            {
                                                this.state.messageFromAdvisor.map((item, index) => {
                                                    return <Link className="message-item" key={index} to={item.goUrl}
                                                                 onClick={event => this.clickEvent(event, item)}>
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
                                    content={Resources.getInstance().bookingBtnText}/>
                    </Form.Group>
                </div>
                <div className="offset-footer"></div>
                <Footer/>
            </div>
        );
    }
}

export default Home;