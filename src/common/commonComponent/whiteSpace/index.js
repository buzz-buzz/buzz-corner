import React, {Component} from 'react';
import './index.css';

class WhiteSpace extends Component {
    render() {
        return (
            <div className="white-space" style={this.props.style || {}}>
                <img src={this.props.src || "//cdn-corner.resource.buzzbuzzenglish.com/icon-message-blank-page.svg"}
                     style={this.props.width ? {width: this.props.width} : {}}
                     alt=""/>
                {
                    this.props.message.split('/').map((item, index)=><p key={index}>{item}</p>)
                }
            </div>
        );
    }
}

export default WhiteSpace;