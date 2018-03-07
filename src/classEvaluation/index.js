import React, {Component} from 'react';
import {Form, Button, Segment, TextArea} from 'semantic-ui-react';
import {browserHistory} from 'react-router';
import CurrentUser from "../membership/user";
import ServiceProxy from '../service-proxy';
import {Link} from "react-router";
import './index.css';

class classEvaluation extends Component {
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
            user_type: 1,
            stars: 0,
            evaluation_items: [],
            evaluation_content: ''
        };

        this.changeStars = this.changeStars.bind(this);
        this.evaluationItemsChange = this.evaluationItemsChange.bind(this);

    }

    changeStars(event){
        this.setState({
            stars: parseInt(event.target.name)
        });
    }

    evaluationContentChange(event, data){
        this.setState({
            evaluation_content: data.value
        });
    }

    evaluationItemsChange(event){
        let clonedItems = this.state.evaluation_items;

        if(clonedItems.indexOf(event.target.name) > -1){
            let newItems = [];
            for(let i in clonedItems){
                if(clonedItems[i] !== event.target.name){
                    newItems.push(clonedItems[i]);
                }
            }

            clonedItems = newItems;
        }else{
            clonedItems.push(event.target.name);
        }

        this.setState({
            evaluation_items: clonedItems
        });
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
                {
                    this.state.user_type === 1 ?
                        (
                            <div className="class-detail-practice" id="evaluation" style={{backgroundColor: 'white'}}>
                                <div className="evaluation-stars">
                                    <div className="img-stars">
                                        <img src={ this.state.stars >= 1 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"} onClick={this.changeStars} name="1" />
                                        <img src={ this.state.stars >= 2 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"} onClick={this.changeStars} name="2"  />
                                        <img src={ this.state.stars >= 3 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"} onClick={this.changeStars} name="3" />
                                        <img src={ this.state.stars >= 4 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"} onClick={this.changeStars} name="4" />
                                        <img src={ this.state.stars >= 5 ? "http://p579tk2n2.bkt.clouddn.com/image/icon_stars_active.png" : "//p579tk2n2.bkt.clouddn.com/image/icon_stars.png"} onClick={this.changeStars} name="5" />
                                    </div>
                                    <div className="stars-word">
                                        <p>{this.state.stars === 1 ? '非常差' : (this.state.stars === 2 ? '不满意' : (this.state.stars === 3 ? '一般' : (this.state.stars === 4 ? '比较满意' : (this.state.stars === 5 ? '非常棒' : '请选择'))))}</p>
                                    </div>
                                </div>
                                <div className="evaluation-list">
                                    <a className={ this.state.evaluation_items.indexOf('a') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                         name="a" onClick={this.evaluationItemsChange}>发音不标准</a>
                                    <a className={ this.state.evaluation_items.indexOf('b') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                         name="b" onClick={this.evaluationItemsChange}>语速太快听不懂</a>
                                    <a className={ this.state.evaluation_items.indexOf('c') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                         name="c" onClick={this.evaluationItemsChange}>有本土化发音</a>
                                    <a className={ this.state.evaluation_items.indexOf('d') > -1 ? "evaluation-item-active" : "evaluation-item"}
                                         name="d" onClick={this.evaluationItemsChange}>我不喜欢他/她</a>
                                </div>
                                <div className="evaluation-input">
                                    <Form>
                                        <TextArea autoHeight placeholder='对课程的任何建议' rows={5} maxLength="200"
                                                  value={this.state.evaluation_content} onChange={(event, data) => this.evaluationContentChange(event, data)} />
                                        <p className="text-length-notice">{this.state.evaluation_content.length + '/200'}</p>
                                    </Form>
                                </div>
                                <div className="evaluation-submit">
                                    <div className="evaluation-done">完成</div>
                                </div>
                            </div>
                        ) :
                        (<div className="class-detail-practice">
                            <div className="evaluation-stars"></div>
                            <div className="evaluation-input"></div>
                            <div className="evaluation-submit">
                                <div className="evaluation-done">完成</div>
                            </div>
                        </div>)
                }
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

export default classEvaluation;