import React, {Component} from 'react';
import {Form, Button, Icon} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import './index.css';

class ClassLessons extends Component {
    constructor() {
        super();

        this.state = {
            class_lessons: 0,
            buy_list: [
                {
                    title: '新用户体验包',
                    lessons: '4课时',
                    price: 188,
                    discount: '6%OFF',
                    before: '原价: ¥200元',
                    img_url: ''
                },
                {
                    title: '季度',
                    lessons: '12课时',
                    price: 588,
                    discount: '7%OFF',
                    before: '原价: ¥600元',
                    img_url: ''
                },
                {
                    title: '年卡',
                    lessons: '52课时',
                    price: 2188,
                    discount: '15%OFF',
                    before: '原价: ¥510元',
                    img_url: ''
                }
            ]
        };

        this.back = this.back.bind(this);
    }

    back() {
        window.history.back();
    }

    render() {
        return (
            <div className="class-lessons-page">
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                             onClick={this.back}/>
                    </div>
                    <div className="class-detail-title">购买课时</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-lessons-content">
                    <div className="content-info">
                        <div className="content-info-title">
                            现有课时数
                        </div>
                        <div className="content-numbers">0</div>
                    </div>
                    <div className="content-list">
                        {
                            this.state.buy_list.length &&
                            this.state.buy_list.map((item, index) => {
                                return <div key={index}>
                                    <div className="class-lesson-img">
                                        <img src={item.img_url} alt=""/>
                                    </div>
                                    <div className="class-lesson-info">
                                        <div className="lessons-title">{item.title}</div>
                                        <div className="lessons-price">

                                        </div>
                                        <div className="lessons-number">

                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassLessons;