import React, {Component} from 'react';
import './index.css';

class WhiteSpace extends Component {
    render() {
        return (
            <div className="white-space">
                <img src={this.props.src || "//cdn-corner.resource.buzzbuzzenglish.com/icon-message-blank-page.svg"} alt=""/>
                <p>{this.props.message}</p>
            </div>
        );
    }
}

export default WhiteSpace;