import React, {Component} from 'react';
import './index.css';
import QiniuDomain from '../../../common/systemData/qiniuUrl';

class WhiteSpace extends Component {
    render() {
        return (
            <div className="white-space">
<<<<<<< HEAD
                <img src={this.props.src || QiniuDomain + "/icon-message-blank-page.svg"} alt=""/>
=======
                <img src={this.props.src || "//cdn-corner.resource.buzzbuzzenglish.com/icon-message-blank-page.svg"} alt=""/>
>>>>>>> master
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default WhiteSpace;