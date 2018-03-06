import React, {Component} from 'react';
import {Form, Button, Icon, Segment} from 'semantic-ui-react';
import {Link} from "react-router";
import { browserHistory } from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import Footer from '../layout/footer';
import Welcome from '../common/commonComponent/modalWelcome/index';
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
                    class_id: 41,
                    classes_status: "opened",
                    end_time: "2018-12-25T15:59:00.000Z",
                    start_time: "2018-12-24T15:59:00.000Z",
                    status: "confirmed",
                    topic: null,
                    user_id: 21,
                    companion_name: '',
                    companion_avatar: '',
                    show_date: 'Friday, 29 December',
                    show_time: '11:00 - 11:25'
                },
                {
                    class_id: 41,
                    classes_status: "opened",
                    end_time: "2018-12-25T15:59:00.000Z",
                    start_time: "2018-12-24T15:59:00.000Z",
                    status: "confirmed",
                    topic: null,
                    user_id: 21,
                    companion_name: '',
                    companion_avatar: '',
                    show_date: 'Friday, 29 December',
                    show_time: '11:00 - 11:25'
                },
                {
                    class_id: 41,
                    classes_status: "opened",
                    end_time: "2018-12-25T15:59:00.000Z",
                    start_time: "2018-12-24T15:59:00.000Z",
                    status: "confirmed",
                    topic: null,
                    user_id: 21,
                    companion_name: '',
                    companion_avatar: '',
                    show_date: 'Friday, 29 December',
                    show_time: '11:00 - 11:25'
                }
            ],
            message_tab: 'advisor',
            placementDone: false
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

    async getPlacementResult(user_id){
        return  ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/user-placement-tests/${user_id}`
            }
        });
    }

    async getUserClassList(user_id){
        return  ServiceProxy.proxyTo({
            body: {
                uri: `{config.endPoints.buzzService}/api/v1/student-class-schedule/${user_id}`
            }
        });
    }

    transformDay(day){
        switch(day){
            case 1: return 'Monday';break;
            case 2: return 'Tuesday';break;
            case 3: return 'Wednesday';break;
            case 4: return 'Thursday';break;
            case 5: return 'Friday';break;
            case 6: return 'Saturday';break;
            case 0: return 'Sunday';break;
            default : break;
        }
    }

    transformMonth(day){
        switch(day){
            case 0: return 'January';break;
            case 1: return 'February';break;
            case 2: return 'March';break;
            case 3: return 'April';break;
            case 4: return 'May';break;
            case 5: return 'June';break;
            case 6: return 'July';break;
            case 7: return 'August';break;
            case 8: return 'September';break;
            case 9: return 'October';break;
            case 10: return 'November';break;
            case 11: return 'December';break;
            default : break;
        }
    }

    handleClassListData(classList){

        if(classList && classList.length > 0){
            for(let i in classList){
                let dateClone = new Date(classList[0].start_time);
                classList[i].show_date = this.transformDay(dateClone.getDay()) + ', '
                    + dateClone.getDate() + ' ' + this.transformMonth(dateClone.getMonth());
                classList[i].show_time = dateClone.getHours() + ':' + dateClone.getMinutes() + ' - '
                    + new Date(classList[0].end_time).getHours() + ' : ' + new Date(classList[0].end_time).getMinutes();
            }
        }

        return classList;
    }

    async componentDidMount() {
        try {
            document.getElementById('loadingModal').style.display = 'block';

            //check if placement is Done await CurrentUser.getUserId()
            let userId = await CurrentUser.getUserId();

            let placementResult = await this.getPlacementResult(userId);

            let classList = this.handleClassListData(await this.getUserClassList(userId));

            if(!placementResult || !placementResult.detail || placementResult.detail.length < 20){
                this.setState({
                    placementDone: false,
                    booking: classList
                });
            }else if(classList && classList.length > 0){
                this.setState({
                    booking: classList
                });
            }
        } catch (ex) {
            console.log('login failed: ' + ex.toString());
            document.getElementById('loadingModal').style.display = 'none';
        } finally {
            //console.log('login failed');
            document.getElementById('loadingModal').style.display = 'none';
        }
    }

    render() {
        return (
            <div className="my-home">
                <Welcome />
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
                <Segment loading={true} id='loadingModal' style={{border: 'none' ,position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 888, display: 'none'}}>
                </Segment>
                {this.state.tab === 'booking' ?
                    (<div className="home-content">
                        {this.state.booking.length > 0 ?
                            (<div className="items">
                                {
                                    this.state.booking.map((item, index) => {
                                        return <Link className="booking-item" key={index} to={"class/" + item.class_id}>
                                            <div className="booking-item-avatar">
                                                <img src={item.companion_avatar || '//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd'} alt=""/>
                                            </div>
                                            <div className="booking-item-info">
                                                <p className="your-name" style={{fontWeight: 'bold', fontSize: '1.2em', color: '#111'}}>{item.companion_name || 'BuzzBuzz'}</p>
                                                <p className="class-topic" style={{color: '#f7b52a', margin: '.3em 0'}}>{item.topic || 'Sing a New song'}</p>
                                                <p className="class-date" style={{fontSize: '.8em', color: '#aaa'}}>{item.show_date}</p>
                                                <p className="class-time" style={{fontSize: '.8em', color: '#aaa'}}>{item.show_time}</p>
                                            </div>
                                            <div className="booking-item-status">
                                                <p style={item.classes_status === 'cancelled' ? {color: 'red'} : (item.status === 'ended' ? {color: '#aaa'} : {color: 'rgb(106, 225, 8)'})}>{item.classes_status === 'cancelled' ? '已取消' : (item.status === 'ended' ? '已结束' : '已确认')}</p>
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
                                <p>Friends</p>
                            </div>
                            <div className={(this.state.tab === 'message' && this.state.message_tab === 'advisor') ? 'message-advisor active' : 'message-advisor'} onClick={this.messageTabChangeAdvisor}>
                                <p>Advisor</p>
                            </div>
                        </div>
                        {
                            this.state.message_tab === 'friends' ?
                                (<div className="none-items">
                                    <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                </div>) :
                                (this.state.placementDone === true ?
                                    (<div className="none-items">
                                            <p style={{color: 'rgb(170, 170, 170)'}}>你还没有收到消息哦</p>
                                        </div>
                                    ) :
                                    (<div className="items">
                                            <Link className="booking-item" key={'placement-item'} to={"placement"}>
                                                <div className="booking-item-avatar">
                                                    <img src="https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd" alt=""/>
                                                </div>
                                                <div className="booking-item-info">
                                                    <p className="your-name" style={{fontWeight: 'bold', fontSize: '1.2em', color: '#111'}}>小测验</p>
                                                    <p className="class-topic" style={{color: '#f7b52a', margin: '.3em 0'}}>免费智能评测</p>
                                                    <p className="class-date" style={{fontSize: '.8em', color: '#aaa'}}>Buzzbuzz小助手</p>
                                                    <p className="class-time" style={{fontSize: '.8em', color: '#aaa'}}>帮助你更好地和外籍小伙伴交流</p>
                                                </div>
                                                <div className="booking-item-status">
                                                    <p style={{color: 'red'}}>未完成</p>
                                                </div>
                                            </Link>
                                        </div>
                                    ))
                        }
                    </div>)
                }
                <div className="offset-footer"></div>
                <Footer />
            </div>
        );
    }
}

export default Home;