import React, {Component} from 'react';
import Resources from '../resources';
import Track from "../common/track";
import {Link} from "react-router";
import QiniuDomain from '../common/systemData/qiniuUrl';
import './tabletLayout.css';

class TabletHeader extends Component {
    render() {
        return (
            <div className="tablet-header">
                <div className="tablet-logo-left">
                    <img src={ QiniuDomain + "/new_buzz_logo.png"} alt=""/>
                </div>
                <div className="tablet-middle">
                    <p>Login</p>
                </div>
                <div className="tablet-language-right">

                </div>
            </div>
        );
    }
}

export default TabletHeader;
