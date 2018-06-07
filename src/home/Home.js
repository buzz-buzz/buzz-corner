import React, {Component} from 'react';
import {Button, Form, Flag} from 'semantic-ui-react';
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
import './index.css';
import {MemberType} from "../membership/member-type";
import Avatar from '../common/commonComponent/avatar';
import WhiteSpace from '../common/commonComponent/whiteSpace';
import Client from "../common/client";

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
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (isiOS) {
            window.location.href = '/consult';
        } else {
            browserHistory.push('/consult');
        }
    }

    clickEventClassDetail(e, item) {
        try {
            if (window.event) {
                window.event.preventDefault();
            }

            Track.event('首页_课程点击', '课程点击', {'课程状态': item.class_status_show_word || ''});

            if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0) {
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

        //todo

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

    RemoveTouchEventIfAndroid(){
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
        if (isAndroid) {
            document.getElementById('booking-btn').addEventListener('touchstart', this.state.touchEvent, false);
        }
    }

    checkHttpsIfNeed(){
        if (Client.getClient() === 'tablet' && !/MicroMessenger/.test(navigator.userAgent) && window.location.href.indexOf('https') < 0) {
            return  window.location.href.replace('http', 'https').replace('/home', '/placement?tab=message');
        } else {
            return  '/placement?tab=message';
        }
    }

    async componentDidMount() {
        try {
            Track.event('首页_首页Home页面');

            this.setState({loadingModal: true, fullModal: true});

            //check system
            this.RemoveTouchEventIfAndroid();

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

            if (!profile.date_of_birth || (!profile.location && !profile.city && !profile.country) || !profile.name || !(await this.isProfileOK(userId))) {
                browserHistory.push('/my/info');
                return;
            }

            this.setState({fullModal: false});

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

            await window.Promise.all(classList.map(async(item, index) => {
                if (profile.role === MemberType.Student) {
                    if (item.class_end_time && new Date(item.class_end_time) - new Date(item.CURRENT_TIMESTAMP) < 0 && (!item.comment || !item.score)) {
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
                messageFromAdvisor: clonedMessageFromAdvisor,
            }, async() => {
                //TODO 滚动条到页面底部加载more 分頁api
                this.loadMoreEvent();
            });

            await this.handleFeedbackNotifications(userId, clonedMessageFromAdvisor);
        } catch (ex) {
            Track.event('首页_错误', null, {"类型": "错误", "错误内容": ex.toString()});

            this.setState({loadingModal: false, fullModal: false});
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

        //sort clonedMessageFromAdvisor

        this.setState({
            messageFromAdvisor: clonedMessageFromAdvisor,
            messageRead: messageCheck && messageCheck.length > 0,
        })
    }

    loadMoreEvent(){
        function getClientHeight() {
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                return (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                return (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
        }

        function winScroll() {
            let scrollTop = document.documentElement && document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;    //滚动条距离顶部的高度
            let scrollHeight = getClientHeight();   //当前页面的总高度
            let clientHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);    //当前可视的页面高度
            // console.log("top:"+scrollTop+",doc:"+scrollHeight+",client:"+clientHeight);
            if (scrollTop + scrollHeight >= clientHeight) {   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;
                //获取下一页 todo
                //console.log('滚动条距离顶部', scrollTop);
                //console.log('可视的高度', clientHeight);
                //console.log('页面总高度', scrollHeight);
                console.log('到底了');
            } else {
                //滚动条距离顶部的高度小于等于0 TODO
            }
        }

        window.addEventListener('scroll', winScroll);
    }

    componentWillUnmount() {
        let u = window.navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android
        if (isAndroid) {
            document.addEventListener('removeEventListener', this.state.touchEvent, false);
        }

        this.setState({loadingModal: false, fullModal: false});

        this.setState = (state, callback) => {
            return;
        };
    }

    render() {
        return (
            <div className="my-home">
                <LoadingModal loadingModal={this.state.fullModal} fullScreen={true}/>
                <Welcome/>
                <div className="home-header">
                    <a className="consult" onClick={this.signUp}>
                        <img src={QiniuDomain + "/icon_Service.svg"} style={{width: '25px'}} alt=""/>
                    </a>
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}}
                         onClick={this.tabChangeBook}>
                        <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_booking.png" alt="" style={{
                            height: '50%',
                            marginRight: '.5em'
                        }}/>
                        <div>{Resources.getInstance().homeTabBooking}</div>
                        <div className="tab-active"
                             style={this.state.tab === 'booking' ? {borderTop: '2px solid #f7b52a'} : {}}></div>
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
                                } : {display: 'none'}}></div>
                            <div className="message-red-new"
                                 style={this.state.messageRead ? {} : {display: 'none'}}>
                                <img src={QiniuDomain + "/icon_NEW_message.svg"} alt=""/>
                            </div>
                        </div>
                        <div className="tab-active"
                             style={this.state.tab === 'message' ? {borderTop: '2px solid #f7b52a'} : {}}></div>
                    </div>
                </div>
                <LoadingModal loadingModal={this.state.loadingModal}/>
                {this.state.tab === 'booking' ?
                    (<div id="refreshContainer" className="home-content">
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
                                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_Coursepurchase tips.png"
                                         alt=""/>
                                    <p>{Resources.getInstance().bookingNoItemText1}</p>
                                    <p>{ this.state.role === MemberType.Student ? Resources.getInstance().bookingNoItemText2 : Resources.getInstance().bookingNoItemText3}</p>
                                </div>
                            </div>)}
                        <LoadingMore loadingMore={false} />
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
                                     style={this.state.messageRead ? {} : {display: 'none'}}></div>
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
                                            {
                                                this.state.messageFromAdvisor.length &&
                                                <div className="loadmore"></div>
                                            }
                                        </div>
                                    ))
                        }
                    </div>)
                }
                <div className="booking-btn" style={this.state.tab === 'booking' ? {} : {display: 'none'}}>
                    <Form.Group widths='equal'>
                        <Form.Field control={Button} onClick={this.signUp} id="booking-btn"
                                    content={Resources.getInstance().bookingBtnText}/>
                    </Form.Group>
                </div>
                <div className="offset-footer"
                     style={this.state.tab === 'booking' ? {height: '142px'} : {height: '52px'}}></div>
                <Footer/>
            </div>
        );
    }

    async isProfileOK(userId) {
        return await ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/users/is-profile-ok/${userId}`,
                method: 'GET'
            }
        })
    }
}

export default Home;
