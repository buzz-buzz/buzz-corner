import React, {Component} from 'react';
import Resources from '../resources';
import QiniuDomain from '../common/systemData/qiniuUrl';
import './index.css';

class Developing extends Component {
    render() {
        return (
            <div className="developing">
                <div className="develop-img">
                    <img src="//cdn-corner.resource.buzzbuzzenglish.com/icon_blank%20page.png" alt=""/>
                </div>
                <div className="develop-word">
                    {Resources.getInstance().developWord}
                </div>
            </div>
        );
    }
}

export default Developing;