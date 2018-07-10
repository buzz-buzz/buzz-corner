import React from 'react';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
import Resources from '../../resources';
import './index.css';

export default class ClassPartners extends React.Component {
    constructor(){
        super();

        this.goUserCenter = this.goUserCenter.bind(this);
    }

    goUserCenter(event, user_id){
        this.props.sendTrack(event, '中方头像点击');

        browserHistory.push(`/user/${user_id}`);
    }

    render() {
        return <div className="class-partners">
            <div className="s-title">{Resources.getInstance().classDetailClassPartners}</div>
            <div className="class-partners-avatar">
                {
                    this.props.student_avatars.length > 0 &&
                    this.props.student_avatars.map((item, index) => {
                        return <Link key={index} onClick={event => this.goUserCenter(event, item.user_id)}>
                            <img
                                src={item.avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}
                                alt=""/>
                        </Link>
                    })
                }
            </div>
        </div>
    }
}