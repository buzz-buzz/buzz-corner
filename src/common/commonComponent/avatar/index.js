import './index.css'
import React from 'react';
import QiniuDomain from '../../../common/systemData/qiniuUrl';

export default class Avatar extends React.Component {
    render() {
        return (
            <div className="avatar-container"
                 style={{width: this.props.width || '66px', height: this.props.height || '66px', marginBottom : '5px'}}>
<<<<<<< HEAD
                <img src={this.props.src || QiniuDomain + '/logo-image.svg'}
=======
                <img src={this.props.src || '//cdn-corner.resource.buzzbuzzenglish.com/logo-image.svg'}
>>>>>>> master
                     alt="avatar"/>
            </div>
        )
    }
}