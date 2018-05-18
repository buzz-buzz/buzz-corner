import React from 'react';
import {Link} from 'react-router';
import Resources from '../../resources';
import QiniuDomain from '../../common/systemData/qiniuUrl';
import './index.css';

export default class ClassPartners extends React.Component {
    render() {
        return <div className="class-partners">
            <div className="s-title">{Resources.getInstance().classDetailClassPartners}</div>
            <div className="class-partners-avatar">
                {
                    this.props.student_avatars.length > 0 &&
                    this.props.student_avatars.map((item, index) => {
                        return <Link key={index} to={"/user/" + item.user_id} onClick={event => this.props.sendTrack(event, '中方头像点击')}>
                            <img
<<<<<<< HEAD
                                src={item.avatar || QiniuDomain + "/logo-image.svg"}
=======
                                src={item.avatar || "//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg"}
>>>>>>> master
                                alt=""/>
                        </Link>
                    })
                }
            </div>
        </div>
    }
}