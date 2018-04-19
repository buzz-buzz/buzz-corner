import React, {Component} from 'react';
import {Button, Form} from 'semantic-ui-react';
import {browserHistory, Link} from "react-router";
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import Footer from '../layout/footer';
import Welcome from '../common/commonComponent/modalWelcome';
import LoadingModal from '../common/commonComponent/loadingModal';
import TimeHelper from '../common/timeHelper';
import Track from "../common/track";
import './index.css';
import {MemberType} from "../membership/member-type";
import Avatar from '../common/commonComponent/avatar';
import WhiteSpace from '../common/commonComponent/whiteSpace';
import TitleSet from '../common/titleUtil';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: props.location.query.tab || 'booking',
            booking: [],
            message_tab: 'advisor',
            messageFromAdvisor: [],
            messageRead: false,
            touchEvent: function (e) {
                e.preventDefault();

                browserHistory.push('/consult');
            }
        };

        this.tabChangeBook = this.tabChangeBook.bind(this);
        this.tabChangeMessage = this.tabChangeMessage.bind(this);
        this.messageTabChangeFriends = this.messageTabChangeFriends.bind(this);
        this.messageTabChangeAdvisor = this.messageTabChangeAdvisor.bind(this);
        this.signUp = this.signUp.bind(this);
        this.clickEventClassDetail = this.clickEventClassDetail.bind(this);
    }

    signUp() {
        Track.event('首页_预约点击');

        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android

        if (isAndroid) {
            browserHistory.push('/consult');
        } else {
            window.location.href = '/consult';
        }
    }

    clickEventClassDetail(e, item) {
        window.event.preventDefault();

        Track.event('首页_课程点击', '课程点击', {'课程状态': item.class_status_show_word || ''});

        window.location.href = "/class/" + item.class_id;
    }

    clickEventPlacement(e, item) {
        window.event.preventDefault();

        let redStatus = item.hasRead === '' ? '未读' : '已读';

        Track.event('首页_消息点击', '消息点击', {'消息状态': redStatus, '消息类型': '助教'});

        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android

        window.history.replaceState(window.history.state, "home", "?tab=" + this.state.tab);

        if (isAndroid) {
            browserHistory.push(item.goUrl);
        } else {
            window.location.href = item.goUrl;
        }
    }

    tabChangeBook() {
        Track.event('首页_预约Tab点击');

        let tab = this.state.tab;

        if (tab !== 'booking') {
            this.setState({
                tab: 'booking'
            });
        }
    }

    tabChangeMessage() {
        Track.event('首页_消息Tab点击');

        let tab = this.state.tab;

        if (tab !== 'message') {
            this.setState({
                tab: 'message'
            });
        }
    }

    messageTabChangeFriends() {
        Track.event('首页_消息Tab切换为好友');

        let tabIndex = this.state.message_tab;

        if (tabIndex !== 'friends') {
            this.setState({
                message_tab: 'friends'
            });
        }
    }

    messageTabChangeAdvisor() {
        Track.event('首页_消息Tab切换为助教');

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

    async getUserClassList(user_id, role) {
        let url;

        if (role === MemberType.Student) {
            url = `{config.endPoints.buzzService}/api/v1/student-class-schedule/${user_id}`;
        } else if (role === MemberType.Companion) {
            url = `{config.endPoints.buzzService}/api/v1/companion-class-schedule/${user_id}`;
        }

        return ServiceProxy.proxyTo({
            body: {
                uri: url
            }
        });
    }

    async getCompanionEvaluation(class_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/class-feedback/evaluate/${class_id}`
            }
        });
    }

    transformDay(day) {
        return TimeHelper.getWeekdayNameByIndex(day);
    }

    transformMonth(day) {
        return TimeHelper.getMonthNameByIndex(day);
    }

    handleClassListData(classList) {

        if (classList && classList.length > 0) {
            for (let i in classList) {
                let dateClone = new Date(classList[i].class_start_time);

                classList[i].show_date = this.transformDay(dateClone.getDay()) + ', '
                    + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth()) + ', ' + new Date(classList[i].class_end_time).getFullYear();
                classList[i].show_time = (dateClone.getHours() > 9 ? dateClone.getHours() : '0' + dateClone.getHours()) + ':'
                    + (dateClone.getMinutes() > 9 ? dateClone.getMinutes() : '0' + dateClone.getMinutes()) + ' - '
                    + (new Date(classList[i].class_end_time).getHours() > 9 ? new Date(classList[i].class_end_time).getHours() : '0' + new Date(classList[i].class_end_time).getHours() ) + ' : '
                    + (new Date(classList[i].class_end_time).getMinutes() > 9 ? new Date(classList[i].class_end_time).getMinutes() : '0' + new Date(classList[i].class_end_time).getMinutes() );

                classList[i].class_status_show_style = TimeHelper.timeDiffStyle(new Date(classList[i].class_start_time), new Date(classList[i].class_end_time), new Date(classList[i].CURRENT_TIMESTAMP || new Date()));
                classList[i].class_status_show_word = TimeHelper.timeDiff(new Date(classList[i].class_start_time), new Date(classList[i].class_end_time), new Date(classList[i].CURRENT_TIMESTAMP || new Date()), window.navigator.language);
            }
        }

        return classList;
    }

    async componentDidMount() {
        try {
            Track.event('首页_首页Home页面');

            TitleSet.setTitle();

            this.setState({loadingModal: true, fullModal: true});

            //check system
            let u = window.navigator.userAgent;
            let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
            if (isAndroid) {
                document.getElementById('booking-btn').addEventListener('touchstart', this.state.touchEvent, false);
            }

            //check if placement is Done await CurrentUser.getUserId()
            let profile = await CurrentUser.getProfile(true);
            let userId = profile.user_id;

            if (!profile.role) {
                browserHistory.push('/select-role');
                return;
            }

            if (profile.role !== MemberType.Student && profile.role !== MemberType.Companion) {
                browserHistory.push('/under-construction');
                return;
            }

            if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name) {
                browserHistory.push('/my/info');
                return;
            }

            this.setState({fullModal: false});

            let classList = await this.getUserClassList(userId, profile.role);

            classList = classList.filter(function (ele) {
                return ele.status && ele.status !== 'cancelled' && ele.class_id && ele.companion_id;
            });

            classList = this.handleClassListData(classList);

            let clonedMessageFromAdvisor = this.state.messageFromAdvisor;

            //if this is a student, then check placement test
            if (profile.role && profile.role === MemberType.Student) {
                let placementResult = await this.getPlacementResult(userId);

                if (!placementResult || !placementResult.detail || placementResult.detail.length < 20) {

                    clonedMessageFromAdvisor.push({
                        message_title: Resources.getInstance().bookingPlacementInfoTitle,
                        message_content: Resources.getInstance().bookingPlacementInfoContent,
                        message_avatar: '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                        goUrl: '/placement?tab=message',
                        hasRead: ''
                    });
                }
            }

            classList.map(async (item, index) => {
                if (profile.role === MemberType.Student) {
                    if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && (!item.comment || !item.score)) {
                        clonedMessageFromAdvisor.push({
                            message_title: item.companion_name || 'Advisor',
                            message_content: Resources.getInstance().bookingFeedbackNotice + (item.topic || item.name || 'No topic'),
                            message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                            goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id + '?tab=message',
                            hasRead: ''
                        });
                    } else if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && item.comment && item.score) {
                        clonedMessageFromAdvisor.push({
                            message_title: item.companion_name || 'Advisor',
                            message_content: Resources.getInstance().bookingFeedbackInfo + (item.topic || item.name || 'No topic'),
                            message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                            goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id + '?tab=message',
                            hasRead: 'read'
                        });
                    }
                } else if (profile.role === MemberType.Companion) {
                    if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0) {
                        //get companion evaluation is done
                        let result = await this.getCompanionEvaluation(item.class_id);

                        clonedMessageFromAdvisor.push({
                            message_title: item.companion_name || 'Advisor',
                            message_content: Resources.getInstance().bookingFeedbackNotice + (item.topic || item.name || 'No topic'),
                            message_avatar: item.companion_avatar || '//p579tk2n2.bkt.clouddn.com/buzz-teacher.png',
                            goUrl: '/class/foreign/' + item.class_id + '?tab=message',
                            hasRead: result && result.feedback ? 'read' : ''
                        });
                    }
                }

                return item;
            });

            let messageCheck = clonedMessageFromAdvisor.filter(function (item) {
                return item.hasRead !== 'read';
            });

            this.setState({
                messageFromAdvisor: clonedMessageFromAdvisor,
                booking: classList,
                messageRead: messageCheck.length > 0,
                loadingModal: false
            });

            //class_list --->  feedback list
        } catch (ex) {
            console.log('login failed: ' + ex.toString());
            Track.event('首页_错误', null, {"类型": "错误", "错误内容": ex.toString()});

            this.setState({loadingModal: false, fullModal: false});
        }
    }

    componentWillUnmount() {
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
        if (isAndroid) {
            document.addEventListener('removeEventListener', this.state.touchEvent, false);
        }

        this.setState({loadingModal: false, fullModal: false});

        this.setState = (state,callback)=>{
            return;
        };
    }

    render() {
        return (
            <div className="my-home">
                <LoadingModal loadingModal={this.state.fullModal} fullScreen={true}/>
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
                    <Link className="consult" onClick={this.signUp}>
                        <embed src="//p579tk2n2.bkt.clouddn.com/icon_Service.svg" width="24" height="60%"
                               type="image/svg+xml"
                               pluginspage="http://www.adobe.com/svg/viewer/install/"/>
                    </Link>
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index}
                                                     onClick={event => this.clickEventClassDetail(event, item)}>
                                            <Avatar marginRight="2em"
                                                    src={item.companion_avatar}/>
                                            <div className="booking-item-info">
                                                <p className="your-name" style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '15px',
                                                    color: '#000'
                                                }}>{item.companion_name || 'BuzzBuzz'}</p>
                                                <p className="class-topic" style={{
                                                    color: '#f6b40c',
                                                    margin: '.3em 0',
                                                    fontSize: '13px'
                                                }}>{item.topic || 'No topic'}</p>
                                                <p className="class-date"
                                                   style={{fontSize: '11px', color: '#868686'}}>{item.show_date}</p>
                                                <p className="class-time"
                                                   style={{fontSize: '11px', color: '#868686'}}>{item.show_time}</p>
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
                                <p>{Resources.getInstance().homeTabAdvisor + (this.state.messageFromAdvisor.filter(function (ele) {return ele.hasRead === '';}).length > 0 ? '(' + this.state.messageFromAdvisor.filter(function (ele) {return ele.hasRead === '';}).length + ')' : '')}</p>
                                <div className="message-red-circle"
                                     style={this.state.messageRead ? {} : {display: 'none'}}></div>
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <WhiteSpace message={Resources.getInstance().whiteSpaceMessage} />
                                </div>) :
                                (this.state.messageFromAdvisor.length === 0 ?
                                    (<div className="none-items">
                                            <WhiteSpace message={Resources.getInstance().whiteSpaceMessage} />
                                        </div>
                                    ) :
                                    (<div className="message-items">
                                            {
                                                this.state.messageFromAdvisor.map((item, index) => {
                                                    return <Link className="message-item" key={index}
                                                                 onClick={event => this.clickEventPlacement(event, item)}>
                                                        <div className="message-item-avatar">
                                                            <Avatar src={item.message_avatar}/>
                                                            <div className="message-red-circle"
                                                                 style={item.hasRead === 'read' ? {display: 'none'} : {display: 'block'}}></div>
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
                <div className="booking-btn" style={this.state.tab === 'booking' ? {}:{display: 'none'}}>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} onClick={this.signUp} id="booking-btn"
                                    content={Resources.getInstance().bookingBtnText}/>
                    </Form.Group>
                </div>
                <div className="offset-footer" style={this.state.tab === 'booking' ? {height: '132px'}:{height: '52px'}}></div>
                <Footer/>
            </div>
        );
    }
}

export default Home;
