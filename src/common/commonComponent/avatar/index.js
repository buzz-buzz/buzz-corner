import './index.css'
import React from 'react';

export default class Avatar extends React.Component {
    render() {
        return (
            <div className="avatar-container"
                 style={{width: this.props.width || '66px', height: this.props.height || '66px', marginBottom : '5px'}}>
                <img src={this.props.src || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
                     alt="avatar"/>
            </div>
        )
    }
}