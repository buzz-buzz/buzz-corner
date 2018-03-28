import './index.css'
import React from 'react';

export default class Avatar extends React.Component {
    render() {
        return (
            <div className="avatar-container"
                 style={{width: this.props.width || '80px', height: this.props.height || '80px', marginRight: this.props.marginRight || '0'}}>
                <img src={this.props.src || '//resource.buzzbuzzenglish.com/FpfgA6nojLQAcoXjEv7sHfrNlOVd'}
                     alt="avatar"/>
            </div>
        )
    }
}