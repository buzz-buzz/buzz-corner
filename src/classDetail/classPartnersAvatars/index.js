import React from 'react';
import {Link} from 'react-router';
import './index.css';

export default class ClassPartners extends React.Component {
    render() {
        return <div className="class-partners-avatar">
            {
                this.props.student_avatars.length > 0 &&
                this.props.student_avatars.map((item, index) => {
                    return <Link key={index} to="" onClick={event => this.props.sendTrack(event, '中方头像点击')}>
                        <img
                            src={item.avatar || "https://resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd"}
                            alt=""/>
                    </Link>
                })
            }
        </div>
    }
}