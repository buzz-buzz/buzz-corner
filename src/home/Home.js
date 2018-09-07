import React, {Component} from 'react';
import {browserHistory} from "react-router";
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
import WhiteSpace from '../common/commonComponent/whiteSpace';
import UserGuide from '../common/commonComponent/modalUserGuide';
import YunyingModal from '../common/commonComponent/yunyingModal';
import ClassInfoTitle from '../classDetail/classInfoTitle';
import Client from "../common/client";
import ErrorHandler from "../common/error-handler";
import MessageBody from './messageBody';
import './index.css';
import {fundebug} from '../common/logger';
import {connect} from 'react-redux';
import {replaceCurrentUserClassList} from "../redux/actions";
import store from '../redux/store'

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
        this.colorHelper = this.colorHelper.bind(this);
        this.clickEventPlacement = this.clickEventPlacement.bind(this);
    }

    signUp() {
        Track.event('首页_帮助点击');

        let u = window.navigator.userAgent;
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (isiOS) {
            window.location.href = `/help/student_index`;
        } else {
            browserHistory.push(`/help/student_index`);
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
        catch (e) {
        }
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

    async getUserClassList(user_id) {
        return ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/class-schedule/listByUserId/${user_id}`
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
        let inProgress = [];
        let future = [];
        let past = [];

        for (let i in class_list) {
            class_list[i].left_time = (new Date(class_list[i].CURRENT_TIMESTAMP) - new Date(class_list[i].class_start_time)) / 1000;

            let endDiff = new Date(class_list[i].class_end_time) - new Date(class_list[i].CURRENT_TIMESTAMP);

            if (endDiff < 0) {
                past.push(class_list[i]);
            } else {
                let startDiff = new Date(class_list[i].class_start_time) - new Date(class_list[i].CURRENT_TIMESTAMP);

                if (startDiff <= 0) {
                    inProgress.push(class_list[i]);
                } else {
                    future.push(class_list[i]);
                }
            }
        }

        future = future.sort(function (a, b) {
            return b.left_time - a.left_time
        });
        past = past.sort(function (a, b) {
            return a.left_time - b.left_time
        });

        class_list = inProgress.concat(future).concat(past);


        if (class_list && class_list.length) {
            class_list[0].highLight = 1;
        }

        return class_list;
    }

    static checkHttpsIfNeed() {
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

    async componentWillMount() {
        try {
            Track.event('首页_首页Home页面');

            this.setState({loadingModal: true});

            //check if placement is Done await CurrentUser.getUserId()
            let profile = await CurrentUser.getProfile();
            let userId = profile.user_id;

            if (!profile.role) {
                browserHistory.push('/select-role');
                return false;
            }

            if (profile.role !== MemberType.Student && profile.role !== MemberType.Companion) {
                browserHistory.push('/under-construction');
                return false;
            }

            if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name || !(await Home.isProfileOK(userId))) {
                browserHistory.push('/my/info');
                return false;
            }

            if (this.props.location.query.intro) {
                this.checkUserGuideDone(profile.intro_done);
            }

            let classList = await this.getClassListFor(userId);

            let clonedMessageFromAdvisor = this.state.messageFromAdvisor;

            //if this is a student, then check placement test
            if (profile.role && profile.role === MemberType.Student) {
                let placementResult = await this.getPlacementResult(userId);

                if (!placementResult || !placementResult.detail || placementResult.detail.length < 20) {
                    clonedMessageFromAdvisor.push({
                        message_title: Resources.getInstance().bookingPlacementInfoTitle,
                        message_content: Resources.getInstance().bookingPlacementInfoContent,
                        message_avatar: '//cdn-corner.resource.buzzbuzzenglish.com/WeChat_use_tutor.jpg',
                        goUrl: Home.checkHttpsIfNeed(),
                        hasRead: ''
                    });
                }
            }

            await window.Promise.all(classList.map(async (item, index) => {
                if (profile.role === MemberType.Student) {
                    this.calculateFeedbackMessagesForStudent(item, clonedMessageFromAdvisor);
                } else if (profile.role === MemberType.Companion) {
                    await this.calculateFeedbackMessagesForCompanion(item, clonedMessageFromAdvisor);
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
            ErrorHandler.notify('首页_错误: ', ex);

            this.setState({loadingModal: false});
        }
    }

    async calculateFeedbackMessagesForCompanion(item, clonedMessageFromAdvisor) {
        if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && item.class_id !== 'observation') {
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

    calculateFeedbackMessagesForStudent(item, clonedMessageFromAdvisor) {
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
    }

    async getClassListFor(userId) {
        let classList = this.props.classList || await this.refreshMyClassList(userId);

        store.dispatch(replaceCurrentUserClassList(classList));
        return classList;
    }

    async refreshMyClassList(userId) {
        return this.sortClassList(this.handleClassListData((await this.getUserClassList(userId)).filter(function (ele) {
            return ele.status && ele.status !== 'cancelled' && ele.class_id && ele.companion_id;
        })));
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

            ErrorHandler.notify('获取消息失败', ex)
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
        this.setState = (state, callback) => {
            return false;
        };
    }

    colorHelper(color) {
        switch (color) {
            case 'rgb(246, 180, 12)' :
                return '#ffd200';
            case 'rgb(0, 216, 90)' :
                return 'rgb(0, 216, 90)';
            case 'rgb(102, 102, 102)' :
                return '#DFDFE4';
            default :
                break;
        }
    }

    render() {
        return (
            <div className="my-home">
                <Welcome welcome={this.state.welcome}
                         closeWelcome={this.closeWelcome}/>
                <UserGuide
                    modal={this.state.intro_done && this.state.role === MemberType.Student}/>
                <div className="home-header">
                    <div className="consult" onClick={this.signUp}>
                        <img src={QiniuDomain + "/icon_Service_new.svg"}
                             style={{width: '20px'}} alt=""/>
                        <span style={{
                            color: '#000',
                            fontSize: '10px'
                        }}>{Resources.getInstance().homeHelp}</span>
                    </div>
                    <div className="tab-booking"
                         style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeBook}>
                        <div style={{position: 'relative'}}>
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/icon_booking.svg"
                                alt="" style={{
                                width: '24px',
                                marginRight: '10px'
                            }}/>
                            <div>{Resources.getInstance().homeTabBooking}</div>
                            <div className="tab-active"
                                 style={this.state.tab === 'booking' ? {
                                     borderTop: '4px solid #ffd200',
                                     borderTopLeftRadius: '5px',
                                     borderTopRightRadius: '5px'
                                 } : {}}/>
                        </div>
                    </div>
                    <div className="tab-message"
                         style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeMessage}>
                        <div style={{position: 'relative'}}>
                            <img
                                src="//cdn-corner.resource.buzzbuzzenglish.com/icon_message.svg"
                                alt="" style={{
                                width: '24px',
                                marginRight: '10px'
                            }}/>
                            <div style={{position: 'relative'}}>
                                <span>{Resources.getInstance().homeTabMessage}</span>
                                <div className="message-red-new"
                                     style={this.state.messageRead ? {} : {display: 'none'}}>
                                    <img src={QiniuDomain + "/icon_NEW_message.svg"}
                                         alt=""/>
                                </div>
                            </div>
                            <div className="tab-active"
                                 style={this.state.tab === 'message' ? {
                                     borderTop: '4px solid #ffd200',
                                     borderTopLeftRadius: '5px',
                                     borderTopRightRadius: '5px'
                                 } : {}}/>
                        </div>
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
                                        return <ClassInfoTitle course_info={item} index={index}
                                                               key={index} withHalfLine={true}
                                                               onClick={event => this.clickEventClassDetail(event, item)}
                                        />
                                    })
                                }
                            </div>) :
                            (<div className="none-items">
                                <div className="no-items">
                                    <img
                                        src="//cdn-corner.resource.buzzbuzzenglish.com/icon_Coursepurchase tips.png"
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
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <WhiteSpace
                                        message={Resources.getInstance().whiteSpaceMessage}/>
                                </div>) :
                                (this.state.messageFromAdvisor.length === 0 ?
                                    (<div className="none-items">
                                            <WhiteSpace
                                                message={Resources.getInstance().whiteSpaceMessage}/>
                                        </div>
                                    ) :
                                    (<div className="message-items">
                                            {
                                                this.state.messageFromAdvisor.map((item, index) => <MessageBody
                                                    item={item} key={index}
                                                    line={this.state.messageFromAdvisor.length - 1 !== index }
                                                    clickEventPlacement={this.clickEventPlacement}/>)
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

export default connect(store => {
    return {
        classList: store.currentUserClassList
    }
}, null)(Home);
