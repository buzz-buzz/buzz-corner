import React, {Component} from 'react';
import './index.css';
import QiniuDomain from '../../../common/systemData/qiniuUrl';

class WhiteSpace extends Component {
    render() {
        return (
            <div className="white-space">
                <img src={this.props.src || QiniuDomain + "/icon-message-blank-page.svg"} alt=""/>
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default WhiteSpace;