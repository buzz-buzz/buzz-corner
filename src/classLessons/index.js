import React, {Component} from 'react';
import Resources from '../resources';
import CurrentUser from "../membership/user";
import Track from "../common/track";
import './index.css';

class ClassLessons extends Component {
    constructor() {
        super();

        this.state = {
            class_hours: 0,
            buy_list: [
                {
                    title: '新用户体验包',
                    lessons: '4课时',
                    price: 188,
                    discount: '6%OFF',
                    before: '原价: ¥200元',
                    img_url: '//p579tk2n2.bkt.clouddn.com/banner_buzz_youzan_2.jpg',
                    youzan_url: 'https://h5.youzan.com/v2/goods/1y44iz9a3zgsa'
                },
                {
                    title: '季度',
                    lessons: '12课时',
                    price: 588,
                    discount: '7%OFF',
                    before: '原价: ¥600元',
                    img_url: '//p579tk2n2.bkt.clouddn.com/banner_buzz_youzan_3.jpg',
                    youzan_url: 'https://h5.youzan.com/v2/goods/3f0foz507x14q'
                },
                {
                    title: '年卡',
                    lessons: '52课时',
                    price: 2188,
                    discount: '15%OFF',
                    before: '原价: ¥2600元',
                    img_url: '//p579tk2n2.bkt.clouddn.com/banner_buzz_youzan_5.jpg',
                    youzan_url: 'https://h5.youzan.com/v2/goods/3ewr6gf9jk4fe'
                }
            ]
        };

        this.back = this.back.bind(this);
        this.goYouzanUrl = this.goYouzanUrl.bind(this);
    }

    back() {
        window.history.back();
    }

    goYouzanUrl(event) {
        event.stopPropagation();

        Track.event('购买课时_商品' + (event.target.name + 1) + '点击');
        window.location.href = this.state.buy_list[event.target.name].youzan_url;
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
                <div className="class-detail-header">
                    <div className="arrow">
                        <img style={{width: '20px'}}
                             src="//resource.buzzbuzzenglish.com/image/buzz-corner/icon_back.png" alt=""
                             onClick={this.back}/>
                    </div>
                    <div className="class-detail-title">{Resources.getInstance().myCoins}</div>
                    <div className="class-order">

                    </div>
                </div>
                <div className="class-lessons-content">
                    <div className="content-info">
                        <div className="content-info-title">
                            {Resources.getInstance().classLessons}
                        </div>
                        <div className="content-numbers">{this.state.class_hours || 0}</div>
                    </div>
                    <div className="content-list">
                        {
                            this.state.buy_list.length &&
                            this.state.buy_list.map((item, index) => {
                                return <a key={index}>
                                    <div className="class-lesson-img">
                                        <img src={item.img_url} alt=""/>
                                    </div>
                                    <div className="class-lesson-info">
                                        <div className="lessons-title">{item.title}</div>
                                        <div className="lessons-price">
                                            <div className="price">{item.price}</div>
                                            <div className="yuan">元</div>
                                            <div className="discount">{item.discount}</div>
                                        </div>
                                        <div className="lessons-number">
                                            <div className="lessons">{item.lessons}</div>
                                            <div className="before"><s>{item.before}</s></div>
                                        </div>
                                    </div>
                                    <input className="clickEvent" onClick={this.goYouzanUrl} name={index}/>
                                </a>
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default ClassLessons;