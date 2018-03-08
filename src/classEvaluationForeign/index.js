import React, {Component} from 'react';
import {Form, Button, Segment, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import {Link} from "react-router";
import './index.css';

class classEvaluationForeign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            class_info: {
                topic: 'sing a New song',
                time: '2018-2-1 friday',
                partners: [1, 2, 3],
                status: 2,
                show_date: 'tomorrow, is coming',
                show_time: '00:00 - 00:00'
            },
            stars: 3
        };

        this.back = this.back.bind(this);
    }

    back() {
        window.history.back();
    }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="class-detail">
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                             onClick={this.back}/>
                    </div>
                    <div className="class-detail-title">课后评价</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-detail-info">
                    <div className="class-info">
                        <div className="booking-item-avatar">
                            <img
                                src={this.state.companion_avatar || "//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                                alt=""/>
                        </div>
                        <div className="booking-item-info">
                            <p className="your-name"
                               style={{fontWeight: 'bold', fontSize: '1.2em'}}>{this.state.companion_name || "Buzz"}</p>
                            <p className="class-topic" style={{
                                color: '#f7b52a',
                                margin: '.3em 0'
                            }}>{this.state.class_info.topic || 'Sing a New song'}</p>
                            <p className="class-date"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_date}</p>
                            <p className="class-time"
                               style={{fontSize: '.8em', color: '#aaa'}}>{this.state.class_info.show_time}</p>
                        </div>
                    </div>
                </div>
                <div className="class-detail-foreign-list">
                    <div className="foreign-evaluation-title">
                        <p>对学生评价</p>
                    </div>
                    <div className="chinese-student-evaluation-list">
                        <Link to='/home'>
                            <div className="evaluation-avatar">
                                <img src="//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"/>
                            </div>
                            <div className="evaluation-content-show">
                                <div className="chinese-name">Advisor</div>
                                <div className="evaluation-result">
                                    <p>评价: </p>
                                    <div className="result-stars">
                                        <img src={ this.state.stars >= 1 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"} onClick={this.changeStars} name="1" />
                                        <img src={ this.state.stars >= 2 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"} onClick={this.changeStars} name="2"  />
                                        <img src={ this.state.stars >= 3 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"} onClick={this.changeStars} name="3" />
                                        <img src={ this.state.stars >= 4 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"} onClick={this.changeStars} name="4" />
                                        <img src={ this.state.stars >= 5 ? "//p579tk2n2.bkt.clouddn.com/image/icon_Stars_active1.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_Stars1.png"} onClick={this.changeStars} name="5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
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
            </div>
        );
    }
}

export default classEvaluationForeign;