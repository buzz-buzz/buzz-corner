import React, {Component} from 'react';
import './index.css';

class LoadingAbsoluteModal extends Component {
    render() {
        return (
            <div className='loadingModalAbsolute'>
                <embed src="//cdn-corner.resource.buzzbuzzenglish.com/index.earth-globe-map-spinner.svg" width="240" height="80"
                       type="image/svg+xml"
                       pluginspage="http://www.adobe.com/svg/viewer/install/" />
            </div>
        );
    }
}

export default LoadingAbsoluteModal;