import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import Resources from '../resources';
import CurrentUser from "../membership/user";
import HeaderWithBack from '../common/commonComponent/headerWithBack';
import Track from "../common/track";
import './index.css';

class ClassLessons extends Component {
    constructor() {
        super();

        this.state = {
            class_hours: 0,
            buy_list: [
                {
                    title: '标准学习包',
                    lessons: '4课时',
                    price: 280,
                    discount: '4课时',
                    before: '',
                    img_url: '//cdn-corner.resource.buzzbuzzenglish.com/banner_buzz_youzan_2.jpg',
                    youzan_url: '/'  || 'https://h5.youzan.com/v2/goods/1y44iz9a3zgsa'
                }
            ]
        };

        this.back = this.back.bind(this);
        this.goYouzanUrl = this.goYouzanUrl.bind(this);
    }

    back() {
        if(window.history.length > 2){
            window.history.go(-1);
        }else{
            browserHistory.push('/');
        }
    }

    goYouzanUrl(event) {
        event.stopPropagation();

        Track.event('购买课时_商品' + (event.target.name + 1) + '点击');
        //window.location.href = this.state.buy_list[event.target.name].youzan_url;
    }

    async componentDidMount() {
        try {
            Track.event('购买课时_购买课时页面');

            let profile = await CurrentUser.getProfile();

            this.setState({
                class_hours:  (profile.class_hours || 0) + (profile.booked_class_hours || 0),
                userId: profile.user_id
            });
        }
        catch (ex) {
            console.log(ex.toString());
            //browserHistory.push('/');
        }
    }

    render() {
        return (
            <div className="class-lessons-page">
                <HeaderWithBack goBack={this.back} title={Resources.getInstance().sessions} />
                <div className="class-lessons-content">
                    <div className="content-info">
                        <div className="content-info-title">
                            {Resources.getInstance().classLessons}
                        </div>
                        <div className="content-numbers">{this.state.class_hours || 0}</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassLessons;