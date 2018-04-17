import React, {Component} from 'react';
import './index.css';

class WhiteSpace extends Component {
    render() {
        return (
            <div className="white-space">
                <img src={this.props.src || "//p579tk2n2.bkt.clouddn.com/icon-message-blank-page.svg"} alt=""/>
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default WhiteSpace;