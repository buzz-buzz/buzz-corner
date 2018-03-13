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
                    lessons: 5,
                    price: 31.6,
                    total: 158
                },
                {
                    lessons: 10,
                    price: 28.5,
                    total: 285
                },
                {
                    lessons: 20,
                    price: 25.5,
                    total: 510
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
                        <div className="content-notice">请购买课时后进行预约</div>
                    </div>
                    <div className="content-list">
                        {
                            this.state.buy_list.length &&
                            this.state.buy_list.map((item, index) => {
                                return <div key={index}>
                                    <div className="lessons">{item.lessons}课时</div>
                                    <div className="price">{item.price}元/课时</div>
                                    <div className="total">总计{item.total}元</div>
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