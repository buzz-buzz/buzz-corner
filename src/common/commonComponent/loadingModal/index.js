import React, {Component} from 'react';
import QiniuDomain from '../../systemData/qiniuUrl';
import './index.css';

class LoadingModal extends Component {
    render() {
        return (
            <div className='loadingModal' style={this.props.loadingModal ? (this.props.fullScreen ? {display: 'flex', zIndex: '9999', background: 'white'} : {display: 'flex'}):{}}>
<<<<<<< HEAD
                <embed src={QiniuDomain + "/index.earth-globe-map-spinner.svg"} width="240" height="80"
=======
                <embed src="//cdn-corner.resource.buzzbuzzenglish.com/index.earth-globe-map-spinner.svg" width="240" height="80"
>>>>>>> master
                       type="image/svg+xml"
                       pluginspage="http://www.adobe.com/svg/viewer/install/" />
            </div>
        );
    }
}

export default LoadingModal;