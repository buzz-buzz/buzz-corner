import React, {Component} from 'react';
import Resources from '../resources';
import './index.css';

class Developing extends Component {
    render() {
        return (
            <div className="developing">
                <div className="develop-img"></div>
                <div className="develop-word">
                    {Resources.getInstance().developWord}
                </div>
            </div>
        );
    }
}

export default Developing;