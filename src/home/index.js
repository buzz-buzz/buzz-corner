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
            booking: []
        };

        this.tabChange = this.tabChange.bind(this);
    }

    tabChange(){
        let tab = this.state.tab;

        tab = tab === 'booking' ? 'message' : 'booking';

        this.setState({
            tab: tab
        });
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="my-home">
                <div className="home-header">
                    <div className="tab-booking" style={this.state.tab === 'booking' ? {color: '#f7b52a'} : {}} onClick={this.tabChange}>
                        <Icon name="object group" />
                        <span>booking</span>
                        <div className="tab-active"  style={this.state.tab === 'booking' ? {border: '1px solid #f7b52a'} : {}}></div>
                    </div>
                    <div className="tab-message" style={this.state.tab === 'message' ? {color: '#f7b52a'} : {}} onClick={this.tabChange}>
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