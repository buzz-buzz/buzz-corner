import React, {Component} from 'react';
import {Flag} from 'semantic-ui-react';
import {browserHistory, Link} from "react-router";
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Resources from '../resources';
import Footer from '../layout/footer';
import Welcome from '../common/commonComponent/modalWelcome';
import LoadingModal from '../common/commonComponent/loadingModal';
import LoadingMore from '../common/commonComponent/loadingMore';
import TimeHelper from '../common/timeHelper';
import QiniuDomain from '../common/systemData/qiniuUrl';
import Track from "../common/track";
import {MemberType} from "../membership/member-type";
import Avatar from '../common/commonComponent/avatar';
import WhiteSpace from '../common/commonComponent/whiteSpace';
import UserGuide from '../common/commonComponent/modalUserGuide';
import YunyingModal from '../common/commonComponent/yunyingModal';
import moment from 'moment';
import Client from "../common/client";
import ClassEndTime from "../classDetail/class-end-time";
import './index.css';
import {fundebug} from '../common/logger';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: props.location.query.tab || 'booking',
            booking: [],
            message_tab: 'advisor',
            messageFromAdvisor: [],
            messageRead: false,
            role: '',
            scroll_event: false
        };

        this.tabChangeBook = this.tabChangeBook.bind(this);
        this.tabChangeMessage = this.tabChangeMessage.bind(this);
        this.messageTabChangeFriends = this.messageTabChangeFriends.bind(this);
        this.messageTabChangeAdvisor = this.messageTabChangeAdvisor.bind(this);
        this.signUp = this.signUp.bind(this);
        this.clickEventClassDetail = this.clickEventClassDetail.bind(this);
        this.closeWelcome = this.closeWelcome.bind(this);
    }

    signUp() {
        Track.event('首页_预约点击');

        let u = window.navigator.userAgent;
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (isiOS) {
            window.location.href = this.state.role === MemberType.Student ? '/help' : '/consult';
        } else {
            browserHistory.push(this.state.role === MemberType.Student ? '/help' : '/consult');
        }
    }

    clickEventClassDetail(e, item) {
        try {
            if (window.event) {
                window.event.preventDefault();
            }

            Track.event('首页_课程点击', '课程点击', {'课程状态': item.class_status_show_word || ''});

            if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0 && window.location.host !== 'localhost') {
                window.location.href = window.location.href.replace('http', 'https').replace('/home', "/class/" + item.class_id);
            } else {
                window.location.href = "/class/" + item.class_id;
            }
        }
        catch (e) {}
    }

    clickEventPlacement(e, item) {
        if (window.event) {
            window.event.preventDefault();
        }

        let redStatus = item.hasRead === '' ? '未读' : '已读';

        Track.event('首页_消息点击', '消息点击', {'消息状态': redStatus, '消息类型': '助教'});

        let u = window.navigator.userAgent;
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        window.history.replaceState(window.history.state, "home", "?tab=" + this.state.tab);

        if (isiOS) {
            window.location.href = item.goUrl;
        } else {
            browserHistory.push(item.goUrl);
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

    async getClassFeedbackNotice(user_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/msg/user/${user_id}?type=advisor`
            }
        });
    }

    handleClassListData(classList) {

        if (classList && classList.length > 0) {
            for (let i in classList) {
                classList[i].class_status_show_style = TimeHelper.timeDiffStyle(new Date(classList[i].class_start_time), new Date(classList[i].class_end_time), new Date(classList[i].CURRENT_TIMESTAMP || new Date()));
                classList[i].class_status_show_word = TimeHelper.timeDiff(new Date(classList[i].class_start_time), new Date(classList[i].class_end_time), new Date(classList[i].CURRENT_TIMESTAMP || new Date()), window.navigator.language);
            }
        }

        return classList;
    }

    sortClassList(class_list) {
        //<= 0 >, >0 <
        let future = [];
        let past = [];

        for (let i in class_list) {
            class_list[i].left_time = (new Date(class_list[i].CURRENT_TIMESTAMP) - new Date(class_list[i].class_start_time)) / 1000;
            if (class_list[i].left_time <= 0) {
                future.push(class_list[i]);
            } else {
                past.push(class_list[i]);
            }
        }

        future = future.sort(function (a, b) {
            return b.left_time - a.left_time
        });
        past = past.sort(function (a, b) {
            return a.left_time - b.left_time
        });

        class_list = future;

        for (let f in past) {
            class_list.push(past[f]);
        }

        return class_list;
    }

    checkHttpsIfNeed() {
        if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0) {
            return window.location.href.replace('http', 'https').replace('/home', '/placement?tab=message');
        } else {
            return '/placement?tab=message';
        }
    }

    checkUserGuideDone(intro_done) {
        if (intro_done === 0) {
            this.setState({
                welcome: true
            })
        }
    }

    closeWelcome() {
        this.setState({
            welcome: false,
            intro_done: true
        }, async () => {
            try {
                await ServiceProxy.proxy(`/user-info`, {
                    body: {
                        intro_done: 1
                    },
                    method: 'PUT'
                });
            }
            catch (e) {
                fundebug.notifyError(e);
            }
        });
    }

    async componentDidMount() {
        try {
            Track.event('首页_首页Home页面');

            this.setState({loadingModal: true});

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

            if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name || !(await Home.isProfileOK(userId))) {
                browserHistory.push('/my/info');
                return;
            }

            if (this.props.location.query.intro) {
                this.checkUserGuideDone(profile.intro_done);
            }

            let classList = this.sortClassList(this.handleClassListData((await this.getUserClassList(userId, profile.role)).filter(function (ele) {
                return ele.status && ele.status !== 'cancelled' && ele.class_id && ele.companion_id;
            })));

            let clonedMessageFromAdvisor = this.state.messageFromAdvisor;

            //if this is a student, then check placement test
            if (profile.role && profile.role === MemberType.Student) {
                let placementResult = await this.getPlacementResult(userId);

                if (!placementResult || !placementResult.detail || placementResult.detail.length < 20) {
                    clonedMessageFromAdvisor.push({
                        message_title: Resources.getInstance().bookingPlacementInfoTitle,
                        message_content: Resources.getInstance().bookingPlacementInfoContent,
                        message_avatar: '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
                        goUrl: this.checkHttpsIfNeed(),
                        hasRead: ''
                    });
                }
            }

            await window.Promise.all(classList.map(async (item, index) => {
                if (profile.role === MemberType.Student) {
                    if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && (!item.comment || !item.score) && item.class_id !== 'rookie') {
                        clonedMessageFromAdvisor.push({
                            message_title: item.companion_name || 'Advisor',
                            message_content: Resources.getInstance().bookingFeedbackNotice + (item.topic || item.name || 'No topic'),
                            message_avatar: item.companion_avatar || '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
                            goUrl: '/class/evaluation/' + item.companion_id + '/' + item.class_id + '?tab=message',
                            hasRead: ''
                        });
                    } else if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && item.comment && item.score) {
                        clonedMessageFromAdvisor.push({
                            message_title: item.companion_name || 'Advisor',
                            message_content: Resources.getInstance().bookingFeedbackInfo + (item.topic || item.name || 'No topic'),
                            message_avatar: item.companion_avatar || '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
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
                            message_content: Resources.getInstance().bookingFeedbackNotice + (item.topic || item.name || 'BuzzBuzz'),
                            message_avatar: item.companion_avatar || '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
                            goUrl: '/class/foreign/' + item.class_id + '?tab=message',
                            hasRead: result && result.feedback ? 'read' : ''
                        });
                    }
                }

                return item;
            }));

            this.setState({
                booking: classList,
                loadingModal: false,
                role: profile.role,
                userId: userId,
                messageFromAdvisor: clonedMessageFromAdvisor
            });

            await this.handleFeedbackNotifications(userId, clonedMessageFromAdvisor);
        } catch (ex) {
            Track.event('首页_错误', null, {"类型": "错误", "错误内容": ex.toString()});

            this.setState({loadingModal: false});
        }
    }

    async handleFeedbackNotifications(userId, clonedMessageFromAdvisor) {
        try {
            let classFeedbackNotice = await this.getClassFeedbackNotice(userId);

            classFeedbackNotice.map((item, index) => {
                clonedMessageFromAdvisor.push({
                    message_title: item.from_name || 'Advisor',
                    message_content: Resources.getInstance().bookingFeedbackToMe + (item.class_topic || 'BuzzBuzz'),
                    message_avatar: item.from_avatar || '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
                    goUrl: `/evaluation/${item.from_user_id}/${item.to_user_id}/${item.class_id}?tab=message&msg_id=${item.msg_id}`,
                    hasRead: item.read ? 'read' : ''
                });

                return item;
            });
        } catch (ex) {
            console.error(ex);
        }

        let messageCheck = clonedMessageFromAdvisor.filter(function (item) {
            return item.hasRead !== 'read';
        });

        this.setState({
            messageFromAdvisor: clonedMessageFromAdvisor,
            messageRead: messageCheck && messageCheck.length > 0,
        })
    }

    componentWillUnmount() {
        this.setState({loadingModal: false});

        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        return (
            <div className="my-home">
                <Welcome welcome={this.state.welcome} closeWelcome={this.closeWelcome}/>
                <UserGuide modal={this.state.intro_done && this.state.role === MemberType.Student}/>
                <div className="home-header">
                    <a className="consult" onClick={this.signUp}>
                        <img src={QiniuDomain + "/icon_Service_new.svg"} style={{width: '20px'}} alt=""/>
                        <span style={{color: '#000', fontSize: '10px'}}>{Resources.getInstance().homeHelp}</span>
                    </a>
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeBook}>
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_booking.png" alt="" style={{
                            height: '50%',
                            marginRight: '.5em'
                        }}/>
                        <div>{Resources.getInstance().homeTabBooking}</div>
                        <div className="tab-active"
                             style={this.state.tab === 'booking' ? {borderTop: '2px solid #f7b52a'} : {}}/>
                    </div>
                    <div className="tab-message" style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeMessage}>
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_message.png" alt="" style={{
                            height: '40%',
                            marginRight: '.5em'
                        }}/>
                        <div style={{position: 'relative'}}>
                            <span>{Resources.getInstance().homeTabMessage}</span>
                            <div style={this.state.messageRead ? {
                                width: '25px',
                                display: 'inline-block'
                            } : {display: 'none'}}/>
                            <div className="message-red-new"
                                 style={this.state.messageRead ? {} : {display: 'none'}}>
                                <img src={QiniuDomain + "/icon_NEW_message.svg"} alt=""/>
                            </div>
                        </div>
                        <div className="tab-active"
                             style={this.state.tab === 'message' ? {borderTop: '2px solid #f7b52a'} : {}}/>
                    </div>
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {this.state.tab === 'booking' ?
                    (<div id="refreshContainer" className="home-content">
                        {
                            this.state.role &&
                                <YunyingModal
                                    role={this.state.role}
                                    width={document.body.clientWidth}
                                />
                        }
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index}
                                                     onClick={event => this.clickEventClassDetail(event, item)}>
                                            <div className="booking-item-avatar">
                                                <Avatar src={item.companion_avatar}/>
                                                <Flag
                                                    name={item.companion_country ? item.companion_country.toLowerCase() : 'united states'}/>
                                            </div>
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
                                                   style={{
                                                       fontSize: '11px',
                                                       color: '#868686'
                                                   }}>{moment(item.class_start_time).format("dddd, MMMM Do YYYY")}</p>
                                                <p className="class-time"
                                                   style={{
                                                       fontSize: '11px',
                                                       color: '#868686'
                                                   }}>{moment(item.class_start_time).format("HH:mm")} - <ClassEndTime
                                                    classInfo={item}/>
                                                </p>
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
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_Coursepurchase tips.png"
                                         alt=""/>
                                    <p>{Resources.getInstance().bookingNoItemText1}</p>
                                    <p>{this.state.role === MemberType.Student ? Resources.getInstance().bookingNoItemText2 : Resources.getInstance().bookingNoItemText3}</p>
                                </div>
                            </div>)}
                        <LoadingMore loadingMore={false}/>
                    </div>) :
                    (<div className="home-content">
                        <div className="message-tab">
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'friends') ? 'message-friends active first' : 'message-friends first'}
                                onClick={this.messageTabChangeFriends}>
                                <p>{Resources.getInstance().homeTabFriends}</p>
                            </div>
                            <div
                                className={(this.state.tab === 'message' && this.state.message_tab === 'advisor') ? 'message-advisor active' : 'message-advisor'}
                                onClick={this.messageTabChangeAdvisor}>
                                <p>{Resources.getInstance().homeTabAdvisor + (this.state.messageFromAdvisor.filter(function (ele) {
                                    return ele.hasRead === '';
                                }).length > 0 ? '(' + this.state.messageFromAdvisor.filter(function (ele) {
                                    return ele.hasRead === '';
                                }).length + ')' : '')}</p>
                                <div className="message-red-circle-spe"
                                     style={this.state.messageRead ? {} : {display: 'none'}}/>
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <WhiteSpace message={Resources.getInstance().whiteSpaceMessage}/>
                                </div>) :
                                (this.state.messageFromAdvisor.length === 0 ?
                                    (<div className="none-items">
                                            <WhiteSpace message={Resources.getInstance().whiteSpaceMessage}/>
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
                                                                 style={item.hasRead === 'read' ? {display: 'none'} : {display: 'block'}}/>
                                                        </div>
                                                        <div className="message-body">
                                                            <div className="message-title">{item.message_title}</div>
                                                            <div
                                                                className="message-content">{item.message_content}</div>
                                                        </div>
                                                    </Link>
                                                })
                                            }
                                            {
                                                this.state.messageFromAdvisor.length &&
                                                <div className="loadmore"/>
                                            }
                                        </div>
                                    ))
                        }
                    </div>)
                }
                <div className="offset-footer"
                     style={{height: '52px'}}/>
                <Footer/>
            </div>
        );
    }

    static async isProfileOK(userId) {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/is-profile-ok/${userId}`,
                method: 'GET'
            }
        })
    }
}

export default Home;
