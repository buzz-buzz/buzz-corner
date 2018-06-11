import React from 'react';
import Resources from '../../resources';
import './index.css';

export default class ZoomDownLoad extends React.Component {
    componentWillMount(){
        if(!/MicroMessenger/.test(navigator.userAgent)){
            window.location.href = 'https://zoom.us/download';
        }
    }

    render() {
        return <div className="zoom-download">
            <div className="zoom-header">
                <img src="https://ruanshi2.8686c.com/static/90981/image/new/ZoomLogo.png" alt=""/>
            </div>
            <div className="zoom-title">
                {Resources.getInstance().classZoomDownLoadCenter}
            </div>
            <div className="modal-download">
                {Resources.getInstance().classZoomDownLoadInfo}
            </div>
        </div>
    }
}