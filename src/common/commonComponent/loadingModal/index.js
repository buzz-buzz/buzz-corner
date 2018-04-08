import React, {Component} from 'react';
import './index.css';

class LoadingModal extends Component {
    render() {
        return (
            <div className='loadingModal' style={this.props.loadingModal ? (this.props.fullScreen ? {display: 'flex', zIndex: '9999', background: 'white'} : {display: 'flex'}):{}}>
                <embed src="//p579tk2n2.bkt.clouddn.com/index.earth-globe-map-spinner.svg" width="240" height="80"
                       type="image/svg+xml"
                       pluginspage="http://www.adobe.com/svg/viewer/install/" />
            </div>
        );
    }
}

export default LoadingModal;